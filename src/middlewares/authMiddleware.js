const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            // "Bearer <token>" me se sirf token nikalna
            token = token.split(' ')[1];

            // Token verify karna
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // req object me user ka data daal dena taaki agle function ko mil sake
            req.user = decoded; 
            next(); // Sab theek hai, aage badho
        } catch (error) {
            res.status(401).json({ error: "Not authorized, invalid token" });
        }
    } else {
        // Agar token nahi hai, toh abhi ke liye block nahi karenge taaki tumhara test.html chalta rahe
        // Jab Next.js banega tab isko strict kar denge. Abhi ke liye aage badhne dete hain.
        req.user = null;
        next();
    }
};

module.exports = { protect };