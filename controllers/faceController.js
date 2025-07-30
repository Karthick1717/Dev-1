const FaceData = require('../models/FaceData');
const path = require('path');

exports.registerFace = async (req, res) => {
  const { phone } = req.body;

  if (!req.file || !phone) {
    return res.status(400).json({ message: 'Image and phone number are required' });
  }

  const imagePath = req.file.path;

  try {
    let existing = await FaceData.findOne({ phone });

    if (existing) {
      existing.imagePath = imagePath;
      await existing.save();
      return res.status(200).json({ message: 'Image updated successfully', data: existing });
    }

    const faceData = new FaceData({ phone, imagePath });
    await faceData.save();

    res.status(201).json({ message: 'Face registered successfully', data: faceData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
