require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorMiddleware');

const app = express();

// Database Connectivity
connectDB().then(() => {
    // Run Seeder after DB connection
    const runSeeder = require('./src/utils/seeder');
    runSeeder();
});

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

/**
 * ARCHITECTURE: DOMAIN GATEWAYS
 * ----------------------------
 * Clean, modular routing hierarchy
 */

// Auth is the only global endpoint
app.use('/api/auth', require('./src/routes/authRoutes'));

// Unified Admin Panel Gateway
const adminRoutes = require('./src/routes/admin');
app.use('/api/admin', adminRoutes);

// Student Domain Gateway
app.use('/api/student', require('./src/routes/studentRoutes'));

// Parent Domain Gateway
app.use('/api/parent', require('./src/routes/parentRoutes'));

// Teacher Domain Gateway
app.use('/api/teacher', require('./src/routes/teacherRoutes'));

// Health Probe
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, status: 'admin_panel_active' });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `[System] Admin Backend Active on port ${PORT}`);
});
