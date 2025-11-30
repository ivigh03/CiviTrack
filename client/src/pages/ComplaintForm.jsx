import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import UploadBox from "../components/UploadBox";
import ResultCard from "../components/ResultCard";
import MapView from "../components/MapView";

import { fetchComplaints } from "../features/complaints/complaintSlice";

import "../styles/complaintForm.css";

function ComplaintForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ LOGGED IN USER
const authData = useSelector(
  (state) => state.auth
);

const user =
  authData?.user;

  const [image, setImage] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [preview, setPreview] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [location, setLocation] =
    useState({
      lat: null,
      lng: null,
    });

  const [address, setAddress] =
    useState("");

  const [manualLocation, setManualLocation] =
    useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  const [aiResult, setAiResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // 📸 IMAGE
  const handleImage = (file) => {
    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // 🔍 LOCATION SEARCH
  const handleSearchChange = async (
    value
  ) => {

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
            apiKey:
              import.meta.env
                .VITE_GEOAPIFY_API_KEY,
          },
        }
      );

      setSuggestions(
        res.data.features
      );

    } catch (err) {
      console.error(err);
    }
  };

  // 📍 SELECT LOCATION
  const handleSelectLocation = (
    place
  ) => {

    const lat =
      place.geometry.coordinates[1];

    const lng =
      place.geometry.coordinates[0];

    setLocation({
      lat,
      lng,
    });

    setAddress(
      place.properties.formatted
    );

    setManualLocation(
      place.properties.formatted
    );

    setSuggestions([]);
  };

  // 📤 SUBMIT
  const submitComplaint = async () => {

    try {

      if (
        !image ||
        !title ||
        !description ||
        !address
      ) {
        alert(
          "Please fill all required fields"
        );

        return;
      }

      setLoading(true);

      const formData =
        new FormData();

      // ✅ IMAGE
      formData.append(
        "image",
        image
      );

      // ✅ LOCATION
      formData.append(
        "location",
        JSON.stringify(location)
      );

      // ✅ ADDRESS
      formData.append(
        "address",
        address
      );

      // ✅ TITLE
      formData.append(
        "title",
        title
      );

      // ✅ DESCRIPTION
      formData.append(
        "userDescription",
        description
      );

      // ✅ USER ID (CRITICAL FIX)
console.log("AUTH:", authData);

console.log("USER:", user);

const userId =
  user?.id ||
  user?._id ||
  user?.user?.id ||
  user?.user?._id;

console.log(
  "FINAL USER ID:",
  userId
);

// ✅ SAFETY CHECK
if (!userId) {

  alert(
    "User not found. Please login again."
  );

  return;
}

// ✅ SEND USER ID
formData.append(
  "user",
  String(userId)
);

      const res = await axios.post(
        "http://localhost:5000/api/complaints",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Complaint Added:",
        res.data
      );

      // ✅ REFRESH REDUX
      dispatch(
        fetchComplaints()
      );

      alert(
        "Complaint Submitted!"
      );

      // ✅ REDIRECT
      navigate("/citizen");

    } catch (err) {

      console.error(err);

      alert(
        "Error submitting complaint"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="complaint-form-container">

      <div className="complaint-card">

        <h2 className="form-title">
          Civic Issue Reporter 🚀
        </h2>

        {/* UPLOAD */}
        <div className="form-group">

          <label>
            📷 Upload Issue Image
          </label>

          <UploadBox
            setResult={(data) => {

              setAiResult(data);

              setDescription(
                data?.description || ""
              );

              setTitle(
                data?.category
                  ? data.category
                      .charAt(0)
                      .toUpperCase() +
                    data.category.slice(1)
                  : "General Issue"
              );
            }}

            onImageSelect={
              handleImage
            }
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="preview-image"
            />
          )}

        </div>

        {/* AI RESULT */}
        {aiResult && (
          <div className="form-group">
            <ResultCard
              result={aiResult}
            />
          </div>
        )}

        {/* LOCATION */}
        <div className="form-group">

          <label>
            📍 Location
          </label>

          <input
            type="text"
            placeholder="Search location..."
            value={manualLocation}
            onChange={(e) =>
              handleSearchChange(
                e.target.value
              )
            }
          />

          {/* SUGGESTIONS */}
          {suggestions.length >
            0 && (
            <div className="suggestions-box">

              {suggestions.map(
                (
                  place,
                  index
                ) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() =>
                      handleSelectLocation(
                        place
                      )
                    }
                  >
                    {
                      place.properties
                        .formatted
                    }
                  </div>
                )
              )}

            </div>
          )}

          {address && (
            <p className="selected-address">
              📍 {address}
            </p>
          )}

        </div>

        {/* MAP */}
        {location.lat &&
          location.lng && (
            <div className="form-group">
              <MapView
                lat={location.lat}
                lng={location.lng}
              />
            </div>
          )}

        {/* TITLE */}
        <div className="form-group">

          <label>
            🧾 Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

        </div>

        {/* DESCRIPTION */}
        <div className="form-group">

          <label>
            📝 Description
          </label>

          <textarea
            placeholder="Edit AI description..."
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

        </div>

        {/* SUBMIT */}
        <button
          className="submit-btn"
          onClick={submitComplaint}
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Complaint"}
        </button>

      </div>
    </div>
  );
}

export default ComplaintForm;