const Attendance = require("../models/Attendance");
const User = require("../models/userModel");

exports.upsertDailyAttendance = async (req, res) => {
  const { phone, month, day, status } = req.body;

  if (!phone || !month || !day || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let doc = await Attendance.findOne({ phone, month });

    if (!doc) {
      // No record exists for phone and month, create new
      doc = new Attendance({
        phone,
        month,
        records: [{ day, status }],
      });
    } else {
      // Check if day record exists
      const dayIndex = doc.records.findIndex((r) => r.day === day);

      if (dayIndex !== -1) {
        // Update existing day record
        doc.records[dayIndex].status = status;
      } else {
        // Add new day record
        doc.records.push({ day, status });
      }
    }

    await doc.save();

    res.status(200).json({ message: "Attendance updated", attendance: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAllAttendance = async (req, res) => {
  const phone = req.user.mobile;




  try {
    const records = await Attendance.find({ phone });
    console.log(records)

  

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No attendance found" });
    }

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMonthlyAttendance = async (req, res) => {
const phone = req.user.mobile;
  const { month } = req.params;

  try {
    const record = await Attendance.findOne({ phone, month });

    if (!record) {
      return res.status(404).json({ message: "No record for this month" });
    }

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDailyStatus = async (req, res) => {
 const phone = req.user.mobile;
  const { month, day } = req.params;

  try {
    const record = await Attendance.findOne({ phone, month });

    if (!record) {
      return res.status(404).json({ message: "Month record not found" });
    }

    const dayRecord = record.records.find(r => r.day === day);

    if (!dayRecord) {
      return res.status(404).json({ message: "No record for this day" });
    }

    res.status(200).json({ day, status: dayRecord.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const records = await User.find({ role: "Nurse" });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No nurse records found" });
    }

    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching all nurse records:", err);
    res.status(500).json({ error: err.message });
  }
};




