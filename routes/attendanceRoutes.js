const express = require("express");
const router = express.Router();
const { getAttendance, addAttendance } = require("../controllers/attendanceController");

router.get("/:phone", getAttendance);
router.post("/", addAttendance);

module.exports = router;
