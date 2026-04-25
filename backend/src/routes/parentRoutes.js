const express = require('express');
const router = express.Router();
const resultController = require('../controllers/parent/resultController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('parent'));

router.get('/children-results', resultController.getMyChildrenResults);

module.exports = router;
