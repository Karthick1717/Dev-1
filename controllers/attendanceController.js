const Attendance = require("../models/Attendance");

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
