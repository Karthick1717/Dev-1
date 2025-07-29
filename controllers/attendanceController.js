const Attendance = require("../models/Attendance");

exports.upsertDailyAttendance = async (req, res) => {
  const { phone, month, day, status } = req.body;

  try {
    let doc = await Attendance.findOne({ phone, month });

    if (!doc) {
      // Create a new month record for the nurse
      doc = new Attendance({
        phone,
        month,
        records: [{ day, status }],
      });
    } else {
      // Find if the day's record already exists
      const index = doc.records.findIndex(r => r.day === day);

      if (index !== -1) {
        doc.records[index].status = status; // update
      } else {
        doc.records.push({ day, status }); // insert
      }
    }

    await doc.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
