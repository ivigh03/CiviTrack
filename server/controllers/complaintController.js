import { analyzeImage } from "../services/geminiService.js";
import fs from "fs";

export const analyzeComplaintImage = async (req, res) => {
  try {
    const filePath = req.file.path;

    const aiResult = await analyzeImage(filePath);

    // delete image after processing
    fs.unlinkSync(filePath);

    let parsed;

    try {
      parsed = JSON.parse(aiResult);
    } catch {
      parsed = { description: aiResult }; // fallback
    }

    res.json({
      success: true,
      data: parsed,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image analysis failed",
    });
  }
};