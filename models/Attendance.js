const mongoose = require("mongoose");

const dailySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  startTime: { type: Date }, // optional on first check-in
  endTime: { type: Date },   // optional until checkout
  totalHours: { type: Number }, // calculated after checkout
});

const attendanceSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  month: { type: String, required: true }, // e.g., "July 2025"
  records: [dailySchema], // array of daily attendance
});

module.exports = mongoose.model("Attendance", attendanceSchema);
