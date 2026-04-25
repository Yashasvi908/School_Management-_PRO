const express = require('express');
const router = express.Router();
const { registerTeacher, getTeachers } = require('../../controllers/admin/teacherController');

router.get('/', getTeachers);
router.post('/register', registerTeacher);

module.exports = router;
