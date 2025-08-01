const Attendance = require("../models/Attendance");
const User = require("../models/userModel");


exports.upsertDailyAttendance = async (req, res) => {
  const { phone, month, day } = req.body;

  if (!phone || !month || !day) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let doc = await Attendance.findOne({ phone, month });
    const currentTime = new Date();

    if (!doc) {
      // Create new attendance doc with startTime
      doc = new Attendance({
        phone,
        month,
        records: [{
          day,
          startTime: currentTime,
        }],
      });
      await doc.save();
      return res.status(200).json({ message: "Start time recorded", attendance: doc });
    }

    // Find day record
    let existingDay = doc.records.find((r) => r.day === day);

    if (!existingDay) {
      // No record for this day, create one with startTime
      doc.records.push({
        day,
        startTime: currentTime,
      });
      await doc.save();
      return res.status(200).json({ message: "Start time recorded", attendance: doc });
    }

    if (!existingDay.startTime) {
      // If startTime missing, set it now
      existingDay.startTime = currentTime;
      existingDay.endTime = undefined;
      existingDay.totalHours = undefined;

      await doc.save();
      return res.status(200).json({ message: "Start time recorded", attendance: doc });
    }

    // Update endTime on every scan after startTime
    existingDay.endTime = currentTime;
    existingDay.totalHours = (existingDay.endTime - existingDay.startTime) / (1000 * 60 * 60); // hours



    

    await doc.save();
    return res.status(200).json({ message: "End time updated", attendance: doc });
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

exports.getStaffByPhone = async (req, res) => {
  
  try {
    const staff = await User.findOne({ mobile: req.params.phone });

    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Server error" });
  }
};





