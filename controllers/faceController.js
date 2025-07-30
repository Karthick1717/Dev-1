const cloudinary = require("../Utils/cloudinary");
const Face = require("../models/FaceData");

exports.registerFace = async (req, res) => {
  try {
    const { phone } = req.body;
    const image = req.file;

    if (!phone || !image) {
      return res.status(400).json({ message: "Phone and image are required" });
    }

    // Upload to Cloudinary from memory buffer
    const base64Image = `data:image/jpeg;base64,${image.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "face_register", // optional folder name
      public_id: phone, // use phone number as ID
      overwrite: true,
    });

    const newFace = new Face({
      phone,
      imageUrl: result.secure_url,
    });

    await newFace.save();

    res.status(200).json({ message: "Face registered successfully", imageUrl: result.secure_url });
  } catch (err) {
    console.error("Register face error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
