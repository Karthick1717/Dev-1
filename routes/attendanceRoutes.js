const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const protect = require("../middlewares/authMiddleware");

router.post("/daily",protect, attendanceController.upsertDailyAttendance); // POST /api/attendance/daily

router.get("/all", protect, attendanceController.getAllAttendance);
router.get("/month/:month", protect, attendanceController.getMonthlyAttendance);
router.get("/day/:month/:day", protect, attendanceController.getDailyStatus);



module.exports = router;
