const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');

// All routes under /api/admin require Admin/Principal roles
router.use(protect);
router.use(authorize('admin', 'superadmin', 'principal', 'teacher'));

// Sub-Route Registration
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/students', require('./studentRoutes'));
router.use('/parents', require('./parentRoutes'));
router.use('/teachers', require('./teacherRoutes'));
router.use('/academic', require('./academicRoutes'));
router.use('/finance', require('./financeRoutes'));
router.use('/exams', require('./examRoutes'));
router.use('/communication', require('./communicationRoutes'));
router.use('/system', require('./systemRoutes'));
router.use('/settings', require('./settingsRoutes'));
router.use('/resources', require('./resourcesRoutes'));
router.use('/analytics', require('./analyticsRoutes'));
router.use('/staff', require('./staffRoutes'));
router.use('/attendance', require('../attendanceRoutes'));
router.use('/leave', require('../leaveRoutes'));

module.exports = router;
