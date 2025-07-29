const Attendance = require("../models/Attendance");

exports.getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ phone: req.params.phone });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAttendance = async (req, res) => {
  try {
    const newEntry = new Attendance(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
