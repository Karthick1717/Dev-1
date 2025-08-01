const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  date: String, // e.g. '2025-07-29'
  hoursWorked: Number,
  dailyWage: Number
});

const salarySchema = new mongoose.Schema({
  phone: String,
  month: String, // e.g., '2025-07'
  bonus: Number,
  deductions: Number,
  net: Number,
  days: [daySchema] // New field to store daily breakdown
});

module.exports = mongoose.model('Salary', salarySchema);
