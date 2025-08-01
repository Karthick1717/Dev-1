const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  const { name, initial, email, mobile, role, password } = req.body;
  
  try {
    const userExists = await User.findOne({ mobile });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, initial, email, mobile, role, password });
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { mobile, password } = req.body;
  
  try {
    const user = await User.findOne({ mobile });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


