const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, regNumber, branch } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Please fill all required fields" });
        }

        if (role === 'student' && (!regNumber || !branch)) {
            return res.status(400).json({ error: "Registration Number and Branch are required for students" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            regNumber: role === 'student' ? regNumber : undefined,
            branch: role === 'student' ? branch : undefined
        });

        res.status(201).json({ success: true, message: `${role} registered successfully! Please login.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                role: user.role,
                regNumber: user.regNumber,
                branch: user.branch 
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };