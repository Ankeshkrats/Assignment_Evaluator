const extractionService = require('../services/extractionService');
const aiService = require('../services/aiEvaluationService');
const Assignment = require('../models/assignmentModel'); 

const processUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded! Please upload a PDF." });

        const extractedText = await extractionService.extractTextFromFile(req.file);
        
        // Advanced NLP AI Evaluation
        const aiResult = await aiService.evaluateAssignment(extractedText);

        // Database me save karna (With User ID and NLP Metrics)
        const newAssignment = new Assignment({
            studentId: req.user ? req.user.id : null, // AuthGuard se ID nikal li
            subjectName: req.body.subjectName || "General Submission", // Frontend se subject ka naam aayega
            fileName: req.file.originalname,
            extractedText: extractedText,
            aiEvaluation: aiResult 
        });

        const savedAssignment = await newAssignment.save();

        res.status(200).json({
            success: true,
            message: "Assignment Evaluated with Advanced NLP Successfully! 🎓",
            assignmentId: savedAssignment._id,
            evaluation: aiResult
        });

    } catch (error) {
        console.error("Upload Controller Error:", error);
        res.status(500).json({ error: error.message || "Evaluation failed." });
    }
};

const getAssignments = async (req, res) => {
    try {
        const allData = await Assignment.find().sort({ uploadDate: -1 });
        res.status(200).json({ success: true, totalAssignments: allData.length, data: allData });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from database." });
    }
};

module.exports = { processUpload, getAssignments };