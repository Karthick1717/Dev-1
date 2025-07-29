const express = require("express");
const router = express.Router();
const { upsertDailyAttendance } = require("../controllers/attendanceController");

router.post("/daily", upsertDailyAttendance); // POST /api/attendance/daily

module.exports = router;
