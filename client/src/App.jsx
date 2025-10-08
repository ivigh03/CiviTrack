import React, { useState } from "react";
import axios from "axios";
import Home from "./pages/Home";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({
    lat: "",
    lng: ""
  });

  const [showHome, setShowHome] = useState(false); // ✅ toggle UI

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  };

  const submitComplaint = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("location", JSON.stringify(location));
    formData.append("userDescription", description);

    console.log("Sending:", location);
    console.log("Image:", image);

    const res = await axios.post(
      "http://localhost:5000/api/complaints",
      formData
    );

    alert("Complaint Submitted!");
    console.log(res.data);
  };

  // ✅ If Home is enabled → show new UI
  if (showHome) {
    return (
      <div>
        <button
          onClick={() => setShowHome(false)}
          style={{ margin: 20 }}
        >
          ← Back to Basic Form
        </button>

        <Home />
      </div>
    );
  }

  // ✅ Your ORIGINAL UI (unchanged)
  return (
    <div style={{ padding: 20 }}>
      <h2>Report Issue (Basic Form)</h2>

      <button
        onClick={() => setShowHome(true)}
        style={{ marginBottom: 20 }}
      >
        Switch to Smart AI UI 🚀
      </button>

      <input type="file" onChange={handleImage} />
      {preview && <img src={preview} width="200" alt="" />}

      <br /><br />

      <button onClick={getLocation}>Get Location</button>

      <br /><br />

      <textarea
        placeholder="Edit AI description here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={submitComplaint}>Submit</button>
    </div>
  );
}

export default App;