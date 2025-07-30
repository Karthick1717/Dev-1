const express = require('express');
const router = express.Router();
const User = require('../models.');
const { encryptEmbedding } = require('../Utils/crypto');

router.post("/", async (req, res) => {
  const { phone, name, embedding } = req.body;

  try {
    let existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ msg: "Already exists" });

    const { encryptedData, iv } = encryptEmbedding(embedding);

    const newUser = new User({
      phone,
      name,
      encryptedEmbedding: encryptedData,
      iv
    });

    await newUser.save();
    res.json({ msg: "Registered with encrypted pattern" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
