// const mongoose = require("mongoose");
// const quizSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     questions: [
//       {
//         questionText: String,
//         options: [String],
//         correctAnswers: [Number],
//         type: { type: String, enum: ["MCQ", "MSQ"], default: "MCQ" },
//       },
//     ],
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Quiz", quizSchema);

const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        questionType: { type: String, enum: ["mcq", "msq"], required: true },
        options: {
          a: { type: String },
          b: { type: String },
          c: { type: String },
          d: { type: String },
        },
        correctOption: { type: String, required: true }, // Can be 'a' or 'bd'
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
