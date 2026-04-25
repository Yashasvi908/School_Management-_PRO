const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getTeacherStats, 
    getTeacherClasses, 
    getClassStudents 
} = require('../controllers/teacherController');

// All teacher routes are protected
router.use(protect);
router.use(authorize('teacher'));

router.get('/dashboard/stats', getTeacherStats);
router.get('/classes', getTeacherClasses);
router.get('/classes/:classId/students', getClassStudents);

module.exports = router;
