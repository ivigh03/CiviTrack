import { analyzeImage } from "../services/geminiService.js";
import fs from "fs";

export const analyzeComplaintImage = async (req, res) => {
  try {
    const filePath = req.file.path;

    const aiResult = await analyzeImage(filePath);

    // 🧹 delete temp image
    fs.unlinkSync(filePath);

    let parsed;

    try {
      const clean = aiResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(clean);

      // ✅ normalize all fields (important)
      parsed = {
        title: parsed.title || parsed.category || "General Issue",
        category: parsed.category || "general",
        description: parsed.description || "",
        severity: parsed.severity || "medium",
      };

    } catch (err) {
      console.error("Parsing failed:", err);

      parsed = {
        title: "General Issue",
        category: "general",
        description: aiResult,
        severity: "medium",
      };
    }

    res.json({
      success: true,
      data: parsed,
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Image analysis failed",
    });
  }
};