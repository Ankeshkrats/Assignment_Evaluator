const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;