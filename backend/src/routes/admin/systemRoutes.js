const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, resetPassword, getLogs } = require('../../controllers/admin/systemController');

router.get('/users', getUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.patch('/users/:userId/reset-password', resetPassword);
router.get('/logs', getLogs);

module.exports = router;
