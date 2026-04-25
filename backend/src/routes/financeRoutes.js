const express = require('express');
const router = express.Router();
const { getFeeStructures, createFeeStructure, recordPayment } = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/structures')
    .get(getFeeStructures)
    .post(authorize('admin', 'superadmin'), createFeeStructure);

router.post('/payments', authorize('admin', 'accountant'), recordPayment);

module.exports = router;
