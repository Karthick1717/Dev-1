const mongoose = require('mongoose');

const FaceDataSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model('FaceData', FaceDataSchema);
