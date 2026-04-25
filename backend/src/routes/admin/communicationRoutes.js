const express = require('express');
const router = express.Router();
const { sendMessage, getConversations, getChatHistory, getGlobalDirectory } = require('../../controllers/admin/communicationController');

router.get('/conversations', getConversations);
router.get('/directory', getGlobalDirectory);
router.get('/history/:otherId', getChatHistory);
router.post('/send', sendMessage);

module.exports = router;
