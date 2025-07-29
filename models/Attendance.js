const mongoose = require("mongoose");

const dailySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
});

const attendanceSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  month: { type: String, required: true }, // e.g., "July 2025"
  records: [dailySchema], // array of daily status
});

module.exports = mongoose.model("Attendance", attendanceSchema);
