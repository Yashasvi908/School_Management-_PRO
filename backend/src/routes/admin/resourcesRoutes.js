const express = require('express');
const router = express.Router();
const { getBooks, addBook, getRoutes, createRoute } = require('../../controllers/admin/resourcesController');

router.get('/library', getBooks);
router.post('/library', addBook);
router.get('/transport', getRoutes);
router.post('/transport', createRoute);

module.exports = router;
