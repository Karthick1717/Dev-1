const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  name: String,
  encryptedEmbedding: String, // hex string
  iv: String // AES IV used for decryption
});

module.exports = mongoose.model('User', userSchema);
