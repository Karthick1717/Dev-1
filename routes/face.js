const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { decryptEmbedding } = require('../utils/crypto');

function cosineSimilarity(vec1, vec2) {
  const dot = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dot / (mag1 * mag2);
}

router.post("/", async (req, res) => {
  const { embedding } = req.body;
  const users = await User.find();

  let matched = null;

  for (let user of users) {
    const decrypted = decryptEmbedding(user.encryptedEmbedding, user.iv);
    const similarity = cosineSimilarity(decrypted, embedding);
    if (similarity > 0.95) {
      matched = user;
      break;
    }
  }

  if (!matched) return res.status(404).json({ msg: "Face not recognized" });

  const date = new Date().toLocaleDateString();
  await Attendance.updateOne(
    { phone: matched.phone, date },
    { phone: matched.phone, date, status: "Present" },
    { upsert: true }
  );

  res.json({ msg: "Attendance marked", user: matched.name });
});

module.exports = router;
