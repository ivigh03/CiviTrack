import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ THIS is the correct one
      contents: "Explain AI in simple words",
    });

    console.log(response.text);
  } catch (error) {
    console.error("ERROR:", error);
  }
}

run();