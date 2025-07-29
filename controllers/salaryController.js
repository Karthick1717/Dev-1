const Salary = require("../models/Salary");

exports.addOrUpdateSalary = async (req, res) => {
  const { phone, month, basic, bonus, deductions } = req.body;

  try {
    let existing = await Salary.findOne({ phone, month });

    if (!existing) {
      const net = basic + bonus - deductions;
      const newSalary = new Salary({ phone, month, basic, bonus, deductions, net });
      await newSalary.save();
      return res.status(201).json(newSalary);
    }

    // Update totals
    existing.basic += basic;
    existing.bonus += bonus;
    existing.deductions += deductions;
    existing.net = existing.basic + existing.bonus - existing.deductions;

    await existing.save();
    return res.status(200).json(existing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
