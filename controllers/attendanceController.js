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

exports.getAllAttendance = async (req, res) => {
  const phone = req.phone;

  try {
    const records = await Attendance.find({ phone });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No attendance found" });
    }

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMonthlyAttendance = async (req, res) => {
  const phone = req.phone;
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
  const phone = req.phone;
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


