const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // 8-digit code
    teacherId: { type: String, required: true }, // Teacher's email
    subject: String,
    branch: String,
    semester: String,
    questionFileName: String,
    answerKeyFileName: String,
    date: String
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);