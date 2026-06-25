const { GoogleGenerativeAI } = require('@google/generative-ai');

const evaluateAssignment = async (assignmentText) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Please add your real GEMINI_API_KEY in the .env file!");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const MODEL_FALLBACKS = [
        "gemini-2.5-flash-preview-05-20",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
    ];

    const prompt = `
    You are an advanced NLP System and University Professor. Analyze the following student assignment text.
    The text might be extracted from a handwritten document or a clean digital PDF. 
    Perform natural language processing (NLP) metrics evaluation, identify structural layout, check correctness, and score the content.
    
    Student Assignment Text:
    "${assignmentText}"
    
    Instructions:
    1. Clean up and recognize any handwritten artifact typos logically without penalizing the student heavily if semantic meaning is correct.
    2. Compute estimated token counts, extract core key structural phrases, and judge the text readability grade.
    3. Evaluate content quality out of 10 and provide clean, actionable structural feedback.
    
    Return ONLY valid JSON in this exact schema (no markdown, no extra text):
    {
        "score": <number_between_0_to_10>,
        "feedback": "<detailed_constructive_feedback_explaining_pros_and_cons>",
        "nlpAnalysis": {
            "tokenCount": <approximate_word_or_token_count_integer>,
            "keyPhrases": ["<phrase1>", "<phrase2>", "<phrase3>"],
            "readabilityLevel": "<Easy or Medium or Advanced>",
            "handwritingConfidence": "<High or Moderate or Low>"
        }
    }
    `;

    let lastError = null;

    for (const modelName of MODEL_FALLBACKS) {
        try {
            console.log(`🔄 Trying model: ${modelName}...`);

            const model = genAI.getGenerativeModel(
            { model: modelName, generationConfig: { responseMimeType: "application/json" } },
            { apiVersion: "v1" }   // ✅ Force stable v1 API
            );

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const cleaned = responseText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            console.log(`✅ Success with model: ${modelName}`);
            return parsed;

        } catch (error) {
            console.error(`❌ ${modelName} failed:`, error.message);
            lastError = error;
        }
    }

    throw new Error("All Gemini models failed. Last error: " + lastError?.message);
};

module.exports = { evaluateAssignment };