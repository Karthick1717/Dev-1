const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.createHash('sha256').update(String(process.env.ENCRYPT_KEY)).digest('base64').substr(0, 32); // 32 bytes key
const iv = crypto.randomBytes(16); // Initialization Vector

// Encrypt
function encryptEmbedding(embedding) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const json = JSON.stringify(embedding);
  let encrypted = cipher.update(json, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
  };
}

// Decrypt
function decryptEmbedding(encryptedData, ivHex) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

module.exports = { encryptEmbedding, decryptEmbedding };
