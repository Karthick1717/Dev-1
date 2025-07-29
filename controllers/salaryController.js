const Salary = require("../models/Salary");

exports.getSalary = async (req, res) => {
  try {
    const data = await Salary.find({ phone: req.params.phone });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSalary = async (req, res) => {
  try {
    const newSalary = new Salary(req.body);
    await newSalary.save();
    res.status(201).json(newSalary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
