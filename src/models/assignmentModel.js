const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Auth APIs integrate hone tak abhi false rakha hai
    },
    studentName: {
        type: String,
        default: "Anonymous Student"
    },
    subjectName: {
        type: String,
        required: true,
        default: "General Assignment"
    },
    fileName: { 
        type: String, 
        required: true 
    },
    extractedText: { 
        type: String, 
        required: true 
    },
    // Gemini AI dwara nikala gaya detailed NLP aur Score analysis
    aiEvaluation: { 
        score: { type: Number, required: true },
        feedback: { type: String, required: true },
        nlpAnalysis: {
            tokenCount: { type: Number, default: 0 },
            keyPhrases: [{ type: String }],
            readabilityLevel: { type: String, default: "Medium" },
            handwritingConfidence: { type: String, default: "N/A" } // Handwritten text extraction report
        }
    },
    uploadDate: { 
        type: Date, 
        default: Date.now 
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;