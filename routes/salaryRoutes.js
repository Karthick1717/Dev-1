const express = require("express");
const router = express.Router();
const { addOrUpdateSalary } = require("../controllers/salaryController");

router.post("/", addOrUpdateSalary); // POST /api/salary

module.exports = router;
