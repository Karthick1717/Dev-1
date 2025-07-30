const fs = require("fs");
const path = require("path");
const Face = require("../models/FaceData");

exports.registerFace = async (req, res) => {
  try {
    const { phone } = req.body;
    const image = req.file;

    if (!phone || !image) {
      return res.status(400).json({ message: "Phone and image are required" });
    }

    const filePath = path.join(__dirname, `../uploads/${phone}.jpg`);
    fs.writeFileSync(filePath, image.buffer); // Save image

    const newFace = new Face({
      phone,
      imagePath: filePath,
    });

    await newFace.save();

    res.status(200).json({ message: "Face registered successfully" });
  } catch (err) {
    console.error("Register face error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
