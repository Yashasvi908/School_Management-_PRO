const express = require('express');
const router = express.Router();
const { login, logoutUser, setupAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', protect, logoutUser);
router.post('/setup-account', setupAccount);

module.exports = router;
