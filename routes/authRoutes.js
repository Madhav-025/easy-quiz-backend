const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/update", requireAuth, updateUser);
router.delete("/delete", requireAuth, deleteUser);

module.exports = router;
