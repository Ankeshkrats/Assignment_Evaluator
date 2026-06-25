const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const models = {
    textModel: genAI.getGenerativeModel({ model: "gemini-1.5-flash" }),
    embeddingModel: genAI.getGenerativeModel({ model: "text-embedding-004" })
};

module.exports = models;