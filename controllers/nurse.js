const User = require("../models/userModel");
const getNurse = async (req, res) => {
  try {
    // Ensure user is authenticated and is a Nurse
    if (!req.user || req.user.role !== "Nurse") {
      return res.status(403).json({ message: "Access denied. Nurse only." });
    }

    // Return nurse's profile
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in getNurse:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/nurse/email
const updateNurseEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findById(req.user._id);
    user.email = email;
    await user.save();

    res.json({ message: "Email updated successfully", email: user.email });
  } catch (error) {
    console.error("Email update failed", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNurse ,updateNurseEmail };
