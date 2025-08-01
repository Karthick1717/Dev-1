const Attendance = require("../models/Attendance");
const User = require("../models/userModel");
const Salary = require("../models/Salary");

exports.upsertDailyAttendance = async (req, res) => {
  const { phone, month, day } = req.body;

  if (!phone || !month || !day) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let doc = await Attendance.findOne({ phone, month });
    const currentTime = new Date();

    if (!doc) {
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

    let existingDay = doc.records.find((r) => r.day === day);

    if (!existingDay) {
      doc.records.push({
        day,
        startTime: currentTime,
      });
      await doc.save();
      return res.status(200).json({ message: "Start time recorded", attendance: doc });
    }

    if (!existingDay.startTime) {
      existingDay.startTime = currentTime;
      existingDay.endTime = undefined;
      existingDay.totalHours = undefined;
      await doc.save();
      return res.status(200).json({ message: "Start time recorded", attendance: doc });
    }

    // 📍 Mark end time
    existingDay.endTime = currentTime;
    existingDay.totalHours = +((existingDay.endTime - existingDay.startTime) / (1000 * 60 * 60)).toFixed(2); // in hours
    const hoursWorked = existingDay.totalHours;

    await doc.save();

    // 🎯 Salary update
    const user = await User.findOne({ mobile: phone });
    if (!user) return res.status(404).json({ error: "User not found for salary calculation" });

    const perDaySalary = user.salary || 0;
    const dailyWage = hoursWorked * perDaySalary;

    let salaryDoc = await Salary.findOne({ phone, month });

    if (!salaryDoc) {
      salaryDoc = new Salary({
        phone,
        month,
        bonus: 0,
        deductions: 0,
        net: 0,
        days: [],
      });
    }

    const existingSalaryDay = salaryDoc.days.find(d => d.date === day);

    if (existingSalaryDay) {
      // 🔁 Just update it if already exists
      existingSalaryDay.hoursWorked = hoursWorked;
      existingSalaryDay.dailyWage = dailyWage;
    } else {
      // ➕ Push new
      salaryDoc.days.push({
        date: day,
        hoursWorked,
        dailyWage,
      });
    }

    // 🧮 Recalculate net
    const totalWages = salaryDoc.days.reduce((sum, d) => sum + d.dailyWage, 0);
    salaryDoc.net = totalWages + salaryDoc.bonus - salaryDoc.deductions;

    await salaryDoc.save();

    return res.status(200).json({
      message: "End time updated and salary recorded",
      attendance: doc,
      salary: salaryDoc,
    });

  } catch (err) {
    console.error("Error in upsertDailyAttendance:", err);
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





