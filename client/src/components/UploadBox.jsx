import { useState } from "react";
import axios from "axios";

export default function UploadBox({ setResult }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload image first");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/complaints/analyze",
        formData
      );

      setResult({
        ...res.data.data,
        file: file
    });
    } catch (err) {
      alert("Error analyzing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2>Upload Issue Image</h2>

      <input
        type="file"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: "100%", marginTop: 15, borderRadius: 10 }}
        />
      )}

      <br /><br />

      <button onClick={handleUpload}>
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>
    </div>
  );
}