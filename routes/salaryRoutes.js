const express = require("express");
const router = express.Router();
const { getSalary, addSalary } = require("../controllers/salaryController");

router.get("/:phone", getSalary);
router.post("/", addSalary);

module.exports = router;
