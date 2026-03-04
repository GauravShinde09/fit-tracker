const express = require("express");
const { register, login, getUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to verify token

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, getUser); // ✅ Add this route

module.exports = router;
