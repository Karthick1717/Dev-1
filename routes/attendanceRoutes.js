const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const protect = require("../middlewares/authMiddleware");

router.post("/daily",attendanceController.upsertDailyAttendance); // POST /api/attendance/daily

router.get("/all", protect, attendanceController.getAllAttendance);
router.get("/get", protect, attendanceController.getAllStaff);
router.get("/month/:month", protect, attendanceController.getMonthlyAttendance);
router.get("/day/:month/:day", protect, attendanceController.getDailyStatus);
router.get("/phone/:phone", attendanceController.getStaffByPhone);



module.exports = router;
