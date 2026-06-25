require('dotenv').config();

async function checkModels() {
    console.log("🔍 Checking Google Servers for your API Key...");
    try {
        // Direct Google ke server se tumhari key par available models ki list maang rahe hain
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if(data.error) {
            console.log("🔴 API Key Error:", data.error.message);
            return;
        }

        console.log("\n✅ Tumhari API key par ye models AVAILABLE hain:\n");
        // Sirf Gemini models filter karke print karega
        data.models.forEach(m => {
            if(m.name.includes('gemini')) {
                console.log("👉", m.name);
            }
        });
    } catch (e) {
        console.log("System Error:", e.message);
    }
}

checkModels();