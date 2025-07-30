const express = require("express");
const multer = require("multer");
const { registerFace } = require("../controllers/faceController");

const router = express.Router();

// ✅ Store uploaded image in memory (required for Cloudinary base64 upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Route for face registration
router.post("/register", upload.single("image"), registerFace);

module.exports = router;
