const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware'); // Security guard
const { processUpload, getAssignments } = require('../controllers/uploadController');
const { registerUser, loginUser } = require('../controllers/authController');

// ==========================================
// AUTHENTICATION ROUTES (Login/Signup)
// ==========================================
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// ==========================================
// ASSIGNMENT ROUTES
// ==========================================
// Upload route par humne 'protect' middleware laga diya hai
router.post('/upload', protect, upload.single('assignmentFile'), processUpload);
router.get('/assignments', getAssignments);

module.exports = router;