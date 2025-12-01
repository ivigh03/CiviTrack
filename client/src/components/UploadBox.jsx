import { useState } from "react";
import axios from "axios";

export default function UploadBox({
  setResult,
  onImageSelect,
}) {

  const [file, setFile] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // 📸 HANDLE FILE
  const handleFile = (f) => {

    if (!f) return;

    setFile(f);

    setPreview(
      URL.createObjectURL(f)
    );

    // 🔥 SEND TO PARENT
    if (onImageSelect) {
      onImageSelect(f);
    }
  };

  // 🧠 AI ANALYZE
  const handleUpload = async () => {

    if (!file) {

      return alert(
        "Upload image first"
      );
    }

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

    try {

      setLoading(true);

      // ✅ GET AUTH DATA
      const authData =
        JSON.parse(
          localStorage.getItem(
            "auth"
          )
        );

      // ✅ GET TOKEN
      const token =
        authData?.token;

      console.log(
        "TOKEN:",
        token
      );

      // ❌ NO TOKEN
      if (!token) {

        alert(
          "Please login again"
        );

        return;
      }

      // ✅ API CALL
      const res =
        await axios.post(

          "http://localhost:5000/api/complaints/analyze",

          formData,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        "AI RESULT:",
        res.data
      );

      // ✅ SAVE RESULT
      setResult({
        ...res.data.data,
        file,
      });

    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err.response?.data ||
        err.message
      );

      alert(

        err.response?.data
          ?.message ||

        "Error analyzing image"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="upload-box">

      {/* 📂 FILE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleFile(
            e.target.files[0]
          )
        }
      />

      {/* 🖼️ PREVIEW */}
      {preview && (

        <img
          src={preview}
          alt="preview"
          className="preview-image"
        />

      )}

      {/* 🧠 BUTTON */}
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