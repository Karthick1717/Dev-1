const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Face", faceSchema);
