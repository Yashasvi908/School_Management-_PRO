const express = require('express');
const router = express.Router();
const { getParents, importParents, deleteParent } = require('../../controllers/admin/parentController');
const multer = require('multer');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.get('/', getParents);
router.post('/import', upload.single('file'), importParents);
router.delete('/:id', deleteParent);

module.exports = router;
