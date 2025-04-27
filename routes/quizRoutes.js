const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/", requireAuth, createQuiz);
router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", requireAuth, updateQuiz);
router.delete("/:id", requireAuth, deleteQuiz);

module.exports = router;