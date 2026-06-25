const express = require('express');
const cors = require('cors');
require('dotenv').config();

const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');

const connectDB = require('./config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
    res.status(200).json({ 
        status: "Active", 
        message: "Assignment Evaluator API is running perfectly!" 
    });
});

app.post('/api/evaluate', upload.single('assignment'), async (req, res) => {
    try {
        console.log(`\n📄 File received: ${req.file ? req.file.originalname : "No file"}`);

        if (!req.file) {
            return res.status(400).json({ error: "No PDF uploaded" });
        }

        const { subject } = req.body;

        console.log("⚙️ Extracting text from PDF...");
        const pdfData = await pdfParse(req.file.buffer);
        const studentText = pdfData.text;

        if (!studentText || studentText.trim().length < 10) {
            return res.status(400).json({ 
                error: "Could not extract text from PDF. Please upload a text-based PDF." 
            });
        }

        const prompt = `You are a highly strict and intelligent university professor evaluating a student's submission for the subject: "${subject}".

        Student's Extracted Text:
        "${studentText.substring(0, 3000)}"
        Excellent, thorough and accurate
        3. The status must match the score:
        - 0-2 → "Poor"
        - 3-4 → "Below Average"  
        - 5-6 → "Average"
        - 7-8 → "Good"
        - 9-10 → "Excellent"
        4. Return ONLY valid JSON, no markdown, no extra text.

        JSON format to return:
        {
        "score": <ACTUAL_EVALUATED_SCORE_0_TO_10>,
        "status": "<Poor|Below Average|Average|Good|Excellent|Irrelevant>",
        "parameters": [
            {"name": "Concept Accuracy", "score": <0_TO_4>, "max": 4, "status": "<Poor|Average|Good|Excellent>"},
            {"name": "Keyphrase Match", "score": <0_TO_3>, "max": 3, "status": "<Poor|Average|Good|Excellent>"},
            {"name": "Language & Structure", "score": <0_TO_3>, "max": 3, "status": "<Poor|Average|Good|Excellent>"}
        ],
        "strengths": ["<specific strength from the actual text>", "<another strength>"],
        "improvements": ["<specific improvement needed>", "<another improvement>"]
        }`;

        console.log("🧠 Sending to Groq AI...");

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // ✅ FIXED - closing bracket is now correct
        const GROQ_MODELS = [
            "llama3-8b-8192",
            "llama3-70b-8192",
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile"
        ];

        let evaluation = null;
        let lastError = null;

        for (const modelName of GROQ_MODELS) {
            try {
                console.log(`🔄 Trying Groq model: ${modelName}...`);

                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: modelName,
                    temperature: 0.3,
                    response_format: { type: "json_object" }
                });

                const responseText = completion.choices[0].message.content;
                const cleaned = responseText.replace(/```json|```/g, '').trim();
                evaluation = JSON.parse(cleaned);

                console.log(`✅ Groq Success with: ${modelName}, Score: ${evaluation.score}/10`);
                break;

            } catch (err) {
                console.log(`❌ ${modelName} failed: ${err.message}`);
                lastError = err;
            }
        }

        if (!evaluation) {
            throw new Error("All AI models failed. Last error: " + lastError?.message);
        }

        res.json(evaluation);

    } catch (error) {
        console.error("❌ Evaluation Error:", error);
        res.status(500).json({ 
            error: "Failed to process the document with AI: " + error.message 
        });
    }
});

try {
    const apiRoutes = require('./routes/apiRoutes');
    app.use('/api', apiRoutes);
    console.log("✅ API Routes loaded successfully.");
} catch (err) {
    console.log("⚠️ apiRoutes not loaded:", err.message);
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🤖 AI Provider: Groq (Free & Fast)`);
});