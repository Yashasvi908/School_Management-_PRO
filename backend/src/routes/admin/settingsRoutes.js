const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../../controllers/admin/settingsController');

router.get('/school', getSettings);
router.put('/school', updateSettings);

module.exports = router;
