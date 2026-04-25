const express = require('express');
const router = express.Router();
const examController = require('../../controllers/admin/examController');
const { protect, authorize } = require('../../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

// Admin only for scheduling exams
router.post('/', authorize('admin', 'super-admin'), examController.createExam);
router.put('/:id', authorize('admin', 'super-admin'), examController.updateExam);
router.delete('/:id', authorize('admin', 'super-admin'), examController.deleteExam);

// Teachers and Admins can view exams and manage marks
router.get('/', authorize('admin', 'super-admin', 'teacher'), examController.getExams);
router.post('/marks', authorize('admin', 'super-admin', 'teacher'), examController.addMarks);
router.post('/bulk-upload', authorize('admin', 'super-admin', 'teacher'), upload.single('file'), examController.bulkUploadMarks);
router.get('/analytics/:examId', authorize('admin', 'super-admin', 'teacher'), examController.getExamAnalytics);
router.get('/reports-bulk', authorize('admin', 'super-admin', 'teacher'), examController.getClassReportCards);
router.get('/marks-subject', authorize('admin', 'super-admin', 'teacher'), examController.getMarksByExamAndSubject);

module.exports = router;
