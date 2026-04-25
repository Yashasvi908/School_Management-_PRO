const express = require('express');
const router = express.Router();
const resultController = require('../controllers/student/resultController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/my-results', resultController.getMyResults);

module.exports = router;
