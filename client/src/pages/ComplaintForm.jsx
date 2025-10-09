import React, { useState } from "react";
import axios from "axios";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/ResultCard";
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";


function ComplaintForm() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [description, setDescription] = useState("");

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");

  const [manualLocation, setManualLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [aiResult, setAiResult] = useState(null);
  const navigate = useNavigate();
  // 📸 Image
  const handleImage = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔍 Autocomplete search
  const handleSearchChange = async (value) => {
    setManualLocation(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        "https://api.geoapify.com/v1/geocode/autocomplete",
        {
          params: {
            text: value,
            apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
          },
        }
      );

      setSuggestions(res.data.features);
    } catch (err) {
      console.error(err);
    }
  };

  // 📍 Select location
  const handleSelectLocation = (place) => {
    const lat = place.geometry.coordinates[1];
    const lng = place.geometry.coordinates[0];

    setLocation({ lat, lng });
    setAddress(place.properties.formatted);

    setManualLocation(place.properties.formatted);
    setSuggestions([]);
  };

  // 📤 Submit
  const submitComplaint = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("location", JSON.stringify(location));
      formData.append("address", address); // ✅ added
      formData.append("title", title);
      formData.append("userDescription", description);

      const res = await axios.post(
        "http://localhost:5000/api/complaints",
        formData
      );

      alert("Complaint Submitted!");
console.log(res.data);

// ✅ redirect to home
navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error submitting complaint");
    }
  };

  return (
  <div style={{
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f5f7fa",
    minHeight: "100vh"
  }}>
    <div style={{
      width: "600px",
      background: "#fff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }}>
      
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>
        Civic Issue Reporter 🚀
      </h2>

      {/* Upload Section */}
      <div style={{ marginBottom: 25 }}>
        <h3>📷 Upload Issue Image</h3>
        <UploadBox
          setResult={(data) => {
  setAiResult(data);

  setDescription(data?.description || "");

  // 👇 NEW
  setTitle(
    data?.category
      ? data.category.charAt(0).toUpperCase() + data.category.slice(1)
      : "General Issue"
  );
}}
          onImageSelect={handleImage}
        />

        {preview && (
          <img
            src={preview}
            alt=""
            style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
          />
        )}
      </div>

      {/* AI Result */}
      {aiResult && (
        <div style={{ marginBottom: 25 }}>
          <ResultCard result={aiResult} />
        </div>
      )}

      {/* Location Section */}
      <div style={{ marginBottom: 25 }}>
        <h3>📍 Location</h3>

        <input
          type="text"
          placeholder="Search location..."
          value={manualLocation}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: 5,
            overflow: "hidden"
          }}>
            {suggestions.map((place, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  background: "#fff"
                }}
                onClick={() => handleSelectLocation(place)}
                onMouseEnter={(e) =>
                  (e.target.style.background = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "#fff")
                }
              >
                {place.properties.formatted}
              </div>
            ))}
          </div>
        )}

        {address && (
          <p style={{ marginTop: 10, color: "#555" }}>
            📍 {address}
          </p>
        )}
      </div>

      {/* Map */}
      {location.lat && location.lng && (
        <div style={{ marginBottom: 25 }}>
          <MapView lat={location.lat} lng={location.lng} />
        </div>
      )}
<h3>🧾 Title</h3>
<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px"
  }}
/>
      {/* Description */}
      <div style={{ marginBottom: 25 }}>
        <h3>📝 Description</h3>
        <textarea
          placeholder="Edit AI description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={submitComplaint}
        style={{
          width: "100%",
          padding: "12px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Submit Complaint
      </button>
    </div>
  </div>
);
}
export default ComplaintForm;