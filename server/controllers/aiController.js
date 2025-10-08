export const analyzeImage = async (imageUrl) => {
  try {
    const labels = ["pothole", "garbage", "water leakage"];

    const random = labels[Math.floor(Math.random() * labels.length)];

    let description = "";

    if (random === "pothole") {
      description = "Road damaged with visible potholes";
    } else if (random === "garbage") {
      description = "Garbage not collected in this area";
    } else {
      description = "Water pipeline leakage detected";
    }

    return {
      label: random,
      description,
    };
  } catch (err) {
    console.log("AI ERROR:", err);
    return {
      label: "general",
      description: "Issue detected",
    };
  }
};