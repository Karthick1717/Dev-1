const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  phone: { type: String, required: true },
  month: { type: String, required: true }, // Example: "July 2025"
  basic: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  net: { type: Number, required: true },
});

module.exports = mongoose.model("Salary", salarySchema);
