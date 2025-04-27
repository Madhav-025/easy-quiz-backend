const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const { OpenAI } = require("openai");
const { requireAuth } = require("../middlewares/authMiddleware");

const upload = multer({ dest: "uploads/" });




const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function convertMCQsWithOpenAI(ocrArray) {
    const prompt = `
You will be given an array of raw OCR-extracted text from images. Each entry includes a question, options, and possibly the correct option.
Extract and format the data into this structured JSON format:

{
  question: "...",
  questionType: "mcq" or "msq",
  options: {
    a: "...",
    b: "...",
    c: "...",
    d: "..."
  },
  correctOption: "a" or "ab"
}

If correct option is not provided, generate it based on the question and options.
Always alphabetically sort correctOption in msq.

Here is the data:
${JSON.stringify(ocrArray, null, 2)}

Now return only an array like this:
[
  {
    question: "...",
    questionType: "...",
    options: { a: "...", b: "...", c: "...", d: "..." },
    correctOption: "..."
  }
]
`;

  const chatResponse = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const output = chatResponse.choices[0]?.message?.content;
  const jsonString = output.slice(
    output.indexOf("["),
    output.lastIndexOf("]") + 1
  );
  return JSON.parse(jsonString);
}

router.post("/upload", upload.array("images"),requireAuth, async (req, res) => {
  try {
    let num = 1;
    const results = await Promise.all(
      req.files.map(async (file) => {
        const imagePath = path.join(__dirname, "..", file.path);
        const {
          data: { text },
        } = await Tesseract.recognize(imagePath, "eng");
        fs.unlinkSync(imagePath);
        return {
          filename: file.originalname,
          number: num++,
          extractedText: text.trim(),
        };
      })
    );

    const questions = await convertMCQsWithOpenAI(results);
    res.json({ data: questions });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

module.exports = router;
