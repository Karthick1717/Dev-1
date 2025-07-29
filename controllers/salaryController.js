const Salary = require("../models/Salary");


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
