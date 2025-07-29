// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // To use environment variables
const nurseRoutes = require("./routes/nurse");
const attendanceRoutes = require("./routes/attendanceRoutes");
const salaryRoutes = require("./routes/salaryRoutes");



const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", nurseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
