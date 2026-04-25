const express = require('express');
const router = express.Router();
const { getClasses, createClass, getSubjects, createSubject, getActiveClasses } = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/classes/active', authorize('admin', 'superadmin'), getActiveClasses);

router.route('/classes')
    .get(getClasses)
    .post(authorize('admin', 'superadmin'), createClass);

router.route('/subjects')
    .get(getSubjects)
    .post(authorize('admin', 'superadmin'), createSubject);

module.exports = router;
