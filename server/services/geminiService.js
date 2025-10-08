import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("KEY CHECK:", process.env.GEMINI_API_KEY);

export const analyzeImage = async (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/jpeg",
              },
            },
            {
              text: `
Analyze this image of a civic issue.

Return JSON only:

{
  "category": "pothole | garbage | water leakage | other",
  "description": "clear issue description for user",
  "priority": "low | medium | high"
}
              `,
            },
          ],
        },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw error;
  }
};