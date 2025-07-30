// routes/faceRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const faceController = require("../controllers/faceController");

// Configure multer to store in memory (or use diskStorage if needed)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /face/register
router.post("/register", upload.single("image"), faceController.registerFace);

module.exports = router;
