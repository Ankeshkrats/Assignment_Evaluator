const multer = require('multer');

// Memory storage use kar rahe hain (Disk par save nahi hoga)
const storage = multer.memoryStorage();

// File filter taaki koi faltu file upload na kar de (sirf pdf, docx, aur images)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'image/jpeg', 
        'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // File accept kar lo
    } else {
        cb(new Error("Invalid file format. Only PDF, DOCX, JPG, and PNG are allowed!"), false); // Reject kar do
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB ki limit taaki server crash na ho
});

module.exports = upload;