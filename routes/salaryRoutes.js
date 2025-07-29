const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect,salaryController.addOrUpdateSalary); // POST /api/salary
router.get("/allDetail", protect, salaryController.getAllSalaries);
router.get("/month/:month", protect, salaryController.getMonthlySalary);

module.exports = router;
