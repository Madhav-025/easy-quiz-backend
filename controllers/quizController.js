const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    console.log("Creating quiz:", req.body);
    
    const quiz = await Quiz.create({
      title,
      questions,
      createdBy: req.user.id,
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Quiz creation failed" });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Quiz update failed" });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: "Quiz delete failed" });
  }
};
