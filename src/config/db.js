const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Ye .env file se tumhara URL uthayega aur connect karega
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🟢 MongoDB Atlas Connected Successfully! Host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`🔴 MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Agar database connect nahi hua toh server ko yahin rok dega
    }
};

module.exports = connectDB;