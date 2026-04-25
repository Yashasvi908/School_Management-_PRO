const express = require('express');
const router = express.Router();
const { 
    markAttendance, 
    getDailyAttendance, 
    getAttendanceStats, 
    getAttendanceReport, 
    getHolidayCheck, 
    getStudentAttendanceReport,
    exportStudentAttendance,
    loadTeachersForAttendance,
    getTeacherAttendanceReport,
    markTeacherAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', authorize('admin', 'superadmin', 'principal', 'teacher'), getAttendanceStats);
router.get('/report', authorize('admin', 'superadmin', 'principal', 'teacher'), getAttendanceReport);
router.get('/holiday-check', authorize('admin', 'superadmin', 'principal', 'teacher'), getHolidayCheck);
router.get('/students/report', authorize('admin', 'superadmin', 'teacher'), getStudentAttendanceReport);
router.get('/students/export', authorize('admin'), exportStudentAttendance);
router.get('/teachers/load', authorize('admin'), loadTeachersForAttendance);
router.get('/teachers/report', authorize('admin'), getTeacherAttendanceReport);
router.post('/teachers/mark', authorize('admin'), markTeacherAttendance);
router.post('/mark', authorize('admin', 'teacher'), markAttendance);
router.get('/daily', authorize('admin', 'teacher'), getDailyAttendance);

module.exports = router;
