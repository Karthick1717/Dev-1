const express = require("express");
const Nurserouter = express.Router();
const protect = require("../middlewares/authMiddleware");
const { getNurse,updateNurseEmail,updateSalary } = require("../controllers/nurse");

Nurserouter.get("/nurse/profile", protect, getNurse);
Nurserouter.patch("/nurse/email", protect, updateNurseEmail);
Nurserouter.patch("/nurse/salary",  updateSalary);

module.exports = Nurserouter;
