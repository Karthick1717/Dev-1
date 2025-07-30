const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const faceController = require('../controllers/faceController');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder to save images
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique filename
  }
});

const upload = multer({ storage });

// POST /api/face/register
router.post('/register', upload.single('image'), faceController.registerFace);

module.exports = router;
