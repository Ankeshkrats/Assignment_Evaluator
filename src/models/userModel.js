const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    // STUDENT SPECIFIC FIELDS (Anti-Cheat Data)
    regNumber: {
        type: String,
        required: function() { return this.role === 'student'; },
        trim: true
    },
    branch: {
        type: String,
        required: function() { return this.role === 'student'; },
        enum: [
            "Computer Science & Engineering",
            "Information Technology",
            "Electronics & Communication Engineering",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Civil Engineering"
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;