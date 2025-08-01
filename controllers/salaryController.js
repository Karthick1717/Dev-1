const Salary = require("../models/Salary");
const User = require("../models/userModel");


exports.updateOrCreateSalary = async (req, res) => {
  const { phone, month, day, hoursWorked } = req.body;

  try {
    // 🔍 Find user by mobile
    const user = await User.findOne({ mobile: phone });
    if (!user) return res.status(404).json({ error: "User not found for salary" });

    const perDaySalary = user.salary || 0;
    const dailyWage = hoursWorked * perDaySalary;

    // 🔍 Try to find salary record
    let salaryDoc = await Salary.findOne({ phone, month });

    if (!salaryDoc) {
      // ✅ Create new if not exists
      salaryDoc = new Salary({
        phone,
        month,
        bonus: 0,
        deductions: 0,
        net: 0,
        days: [],
      });
    } else {
      // 🔄 Remove previous entry for the same day (to avoid duplicates)
      salaryDoc.days = salaryDoc.days.filter(d => d.date !== day);
    }

    // ➕ Add new day's data
    salaryDoc.days.push({
      date: day,
      hoursWorked,
      dailyWage,
    });

    // 🧮 Recalculate net salary
    const totalWages = salaryDoc.days.reduce((sum, d) => sum + d.dailyWage, 0);
    salaryDoc.net = totalWages + salaryDoc.bonus - salaryDoc.deductions;

    // 💾 Save the document
    await salaryDoc.save();

    return res.status(200).json({ message: "Salary updated successfully", salary: salaryDoc });

  } catch (error) {
    console.error("Error updating/creating salary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





exports.addOrUpdateSalary = async (req, res) => {
  const { phone, month, date, hoursWorked, basic, bonus = 0, deductions = 0 } = req.body;

  try {
const hourlyRate = 100;
const dailyWage = hoursWorked * hourlyRate;

    let existing = await Salary.findOne({ phone, month });

    if (!existing) {
      const net = dailyWage + bonus - deductions;
      const newSalary = new Salary({
        phone,
        month,
        basic,
        bonus,
        deductions,
        net,
        days: [{ date, hoursWorked, dailyWage }]
      });
      await newSalary.save();
      return res.status(201).json(newSalary);
    }

    // Check if day already exists
    const existingDayIndex = existing.days.findIndex(d => d.date === date);

    if (existingDayIndex !== -1) {
      // Update the existing entry
      existing.days[existingDayIndex] = { date, hoursWorked, dailyWage };
    } else {
      // Add new day
      existing.days.push({ date, hoursWorked, dailyWage });
    }

    // Update bonus/deductions (optional logic)
    existing.bonus += bonus;
    existing.deductions += deductions;

    // Recalculate net from all dailyWages
    const totalDailyWages = existing.days.reduce((sum, day) => sum + day.dailyWage, 0);
    existing.net = totalDailyWages + existing.bonus - existing.deductions;

    await existing.save();
    return res.status(200).json(existing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMonthlySalary = async (req, res) => {
  const phone = req.user.mobile;
  const { month } = req.params; // Format: YYYY-MM

  try {
    const salary = await Salary.findOne({ phone, month });

    if (!salary) {
      return res.status(404).json({ message: "No salary record for this month" });
    }

    res.status(200).json({
      phone: salary.phone,
      month: salary.month,
      basic: salary.basic,
      bonus: salary.bonus,
      deductions: salary.deductions,
      net: salary.net,
      days: salary.days.map(day => ({
        date: day.date,
        hoursWorked: day.hoursWorked,
        dailyWage: day.dailyWage
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSalaries = async (req, res) => {
  const phone = req.user.mobile;

  try {
    const salaries = await Salary.find({ phone });

    if (!salaries.length) {
      return res.status(404).json({ message: "No salary records found" });
    }

    res.status(200).json(salaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


