const express = require('express');
const router = express.Router();
const { getFeeStructures, createFeeStructure, getFinanceReports } = require('../../controllers/admin/financeController');

router.get('/structures', getFeeStructures);
router.post('/structures', createFeeStructure);
router.get('/reports', getFinanceReports);

module.exports = router;
