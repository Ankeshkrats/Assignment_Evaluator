const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware'); // Security guard
const { processUpload, getAssignments } = require('../controllers/uploadController');
const { registerUser, loginUser } = require('../controllers/authController');

// Naye models import kar rahe hain cloud sync ke liye
const Session = require('../models/sessionModel');
const Submission = require('../models/submissionModel');

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

// ==========================================
// CLOUD DATABASE ROUTES (For Session & Vault Sync)
// ==========================================

// 1. Naya Session Save Karne Ke Liye
router.post('/sessions', async (req, res) => {
    try {
        const newSession = new Session(req.body);
        await newSession.save();
        res.status(201).json({ message: "Session saved to DB", session: newSession });
    } catch (error) {
        console.error("Session Save Error:", error);
        res.status(500).json({ error: "Failed to save session" });
    }
});

// 2. Teacher Ke Saare Sessions Laane Ke Liye
router.get('/sessions/:email', async (req, res) => {
    try {
        const sessions = await Session.find({ teacherId: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

// 🌟 NAYA ROUTE: STUDENT KE LIYE SESSION VERIFY KARNA (CLOUD SYNC)
router.get('/session/verify/:id', async (req, res) => {
    try {
        const session = await Session.findOne({ id: req.params.id });
        if (session) {
            res.status(200).json(session);
        } else {
            res.status(404).json({ error: "Session not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// 3. Student Ka Submission Save Karne Ke Liye
router.post('/submissions', async (req, res) => {
    try {
        const newSub = new Submission(req.body);
        await newSub.save();
        res.status(201).json({ message: "Submission saved to DB", submission: newSub });
    } catch (error) {
        console.error("Submission Save Error:", error);
        res.status(500).json({ error: "Failed to save submission" });
    }
});

// 4. Teacher Ke Saare Submissions (Vault) Laane Ke Liye
router.get('/submissions/:email', async (req, res) => {
    try {
        const submissions = await Submission.find({ teacherId: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
});

module.exports = router;