const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const { 
    getAllClasses, createClass, getSubjectPool, createSubject, updateSubject, deleteSubject, 
    addSection, assignClassTeacher, generateTimetable, getTimetable, addSlot 
} = require('../../controllers/academicController');

router.route('/classes')
    .get(getAllClasses)
    .post(authorize('admin', 'superadmin', 'principal'), createClass);

router.route('/classes/:id/sections')
    .post(authorize('admin', 'superadmin', 'principal'), addSection);

router.route('/classes/:id/assign-teacher')
    .patch(authorize('admin', 'superadmin', 'principal'), assignClassTeacher);

router.post('/timetable/generate', authorize('admin', 'superadmin', 'principal'), generateTimetable);
router.post('/timetable/slot', authorize('admin', 'superadmin', 'principal'), addSlot);
router.get('/timetable/:classId/:sectionName', authorize('admin', 'superadmin', 'principal'), getTimetable);

router.route('/subjects')
    .get(getSubjectPool)
    .post(authorize('admin', 'superadmin', 'principal'), createSubject);

router.route('/subjects/:id')
    .put(authorize('admin', 'superadmin', 'principal'), updateSubject)
    .delete(authorize('admin', 'superadmin', 'principal'), deleteSubject);

module.exports = router;
