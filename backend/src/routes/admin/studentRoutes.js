const express = require('express');
const router = express.Router();
const { 
    registerStudent, getStudentDirectory, bulkImportStudents, 
    getEnrollmentTrend, getStudentDiversity, probeStudentNetwork,
    getStudentProfile, getStudentById, updateStudent, 
    toggleStudentStatus, generateStudentIdCard, deleteStudent,
    downloadBulkTemplate, getBulkDataSpecs, processBulkUpload
} = require('../../controllers/admin/studentController');

const multer = require('multer');
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/octet-stream' // Sometimes Excel files come through as octet-stream on local Windows environments
        ];
        if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.xlsx')) {
            cb(null, true);
        } else {
            cb(new Error('Only .xlsx files are allowed'), false);
        }
    }
});

router.get('/', getStudentDirectory);
router.get('/enrollment-trend', getEnrollmentTrend);
router.get('/diversity', getStudentDiversity);
router.get('/probe', probeStudentNetwork);
router.get('/bulk-template', downloadBulkTemplate);
router.get('/bulk-specs', getBulkDataSpecs);
router.post('/register', registerStudent);
router.post('/bulk-import', upload.single('file'), bulkImportStudents);
router.post('/bulk-upload', upload.single('file'), processBulkUpload);

router.get('/:id/profile', getStudentProfile);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.patch('/:id/status', toggleStudentStatus);
router.post('/:id/id-card', generateStudentIdCard);
router.delete('/:id', deleteStudent);

module.exports = router;
