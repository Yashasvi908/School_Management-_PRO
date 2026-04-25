const express = require('express');
const router = express.Router();
const { applyLeave, getLeaveRequests, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/requests', authorize('admin', 'superadmin', 'principal'), getLeaveRequests);
router.post('/apply', authorize('admin', 'teacher', 'staff'), applyLeave);
router.put('/status/:id', authorize('admin', 'superadmin', 'principal'), updateLeaveStatus);

module.exports = router;
