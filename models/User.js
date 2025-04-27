const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quizzesAttempted: [
      {
        quizId: mongoose.Schema.Types.ObjectId,
        score: Number,
        answers: [String],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// models/Quiz.js
