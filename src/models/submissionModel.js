const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Session Code
    teacherId: { type: String, required: true },
    name: String,
    roll: String,
    branch: String,
    semester: String,
    subject: String,
    date: String,
    status: String,
    statusColor: String,
    score: Number,
    evaluationData: Object // AI ka poora result save karne ke liye
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);