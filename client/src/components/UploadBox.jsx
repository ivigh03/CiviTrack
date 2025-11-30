import { useState } from "react";
import axios from "axios";

export default function UploadBox({
  setResult,
  onImageSelect,
}) {

  const [file, setFile] = useState(null);

  const [preview, setPreview] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // 📸 Handle File
  const handleFile = (f) => {
    if (!f) return;

    setFile(f);

    setPreview(
      URL.createObjectURL(f)
    );

    // 🔥 send image to parent
    if (onImageSelect) {
      onImageSelect(f);
    }
  };

  // 🧠 AI Analyze
  const handleUpload = async () => {
    if (!file) {
      return alert(
        "Upload image first"
      );
    }

    const formData = new FormData();

    formData.append(
      "image",
      file
    );

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/complaints/analyze",
        formData
      );

      setResult({
        ...res.data.data,
        file,
      });

    } catch (err) {
      console.error(err);

      alert(
        "Error analyzing image"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-box">

      {/* FILE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleFile(
            e.target.files[0]
          )
        }
      />

      {/* PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="preview-image"
        />
      )}

      {/* ANALYZE BUTTON */}
      <button
        className="analyze-btn"
        onClick={handleUpload}
      >
        {loading
          ? "Analyzing..."
          : "Analyze Image"}
      </button>

    </div>
  );
}