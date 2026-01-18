import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Gemini Developer API embedding model (verified against a live call —
// "text-embedding-004" is a Vertex-only model id and 404s on this API version)
const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_MODEL_NAME = EMBEDDING_MODEL;

export const embedText = async (text) => {
  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        taskType: "SEMANTIC_SIMILARITY",
      },
    });

    const values = response?.embeddings?.[0]?.values;

    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("Gemini returned an empty embedding");
    }

    return values;
  } catch (error) {
    console.error("GEMINI EMBEDDING ERROR:", error);
    throw error;
  }
};

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