const express = require('express');
const router = express.Router();
const staffController = require('../../controllers/admin/staffController');
const { protect, authorize } = require('../../middleware/authMiddleware');

router.use(protect);
router.use(authorize('superadmin', 'admin'));

router.route('/')
    .get(staffController.getStaff)
    .post(staffController.registerStaff);

router.route('/:id')
    .put(staffController.updateStaff)
    .delete(staffController.deleteStaff);

module.exports = router;
