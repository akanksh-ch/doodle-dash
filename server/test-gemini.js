require('dotenv').config({ path: 'server/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    try {
        console.log("Trying gemini-flash-latest...");
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("Success:", response.text());
    } catch (e) {
        console.log("Failed:", e.message);
    }
}

test();
