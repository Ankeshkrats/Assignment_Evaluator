const pdfParse = require('pdf-parse');

const extractTextFromFile = async (file) => {
    try {
        let extractedText = "";

        if (file.mimetype === 'application/pdf') {
            // Ab ye smoothly kaam karega bina kisi error ke
            const pdfData = await pdfParse(file.buffer);
            extractedText = pdfData.text;
        } 
        else if (file.mimetype.includes('wordprocessingml')) {
            extractedText = "DOCX extraction pending...";
        }
        else if (file.mimetype.includes('image')) {
            extractedText = "Image OCR pending...";
        }

        return extractedText.replace(/\n\s*\n/g, '\n').trim();

    } catch (error) {
        console.error("Text Extraction Failed:", error);
        throw new Error("Failed to extract text from the document.");
    }
};

module.exports = {
    extractTextFromFile
};