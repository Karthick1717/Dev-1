const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: { // Changed from imagePath to imageUrl for clarity
    type: String,
    required: true,
  },
}, {
  timestamps: true // Optional: adds createdAt & updatedAt
});

module.exports = mongoose.model("Face", faceSchema);
