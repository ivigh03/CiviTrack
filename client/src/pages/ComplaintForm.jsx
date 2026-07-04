import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MapPin, Rocket } from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import UploadBox from "../components/UploadBox";
import ResultCard from "../components/ResultCard";
import MapView from "../components/MapView";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

import { fetchComplaints } from "../features/complaints/complaintSlice";

function ComplaintForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ LOGGED IN USER
const { user } = useSelector(
  (state) => state.auth
);

// ✅ CURRENT USER ID
const currentUserId =
  user?.id || user?._id;

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

      toast.error(
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

    // ✅ GET USER ID
    const userId =
      currentUserId;

    if (!userId) {

      toast.error(
        "User not found. Please login again."
      );

      return;
    }

    // ✅ SEND USER
    formData.append(
      "user",
      String(userId)
    );

    // ✅ GET TOKEN
    const authData = JSON.parse(
      localStorage.getItem("auth")
    );

    const token = authData?.token;

    // ✅ API CALL
    const res = await axios.post(
      "http://localhost:5000/api/complaints",

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

    // ✅ REFRESH REDUX
    await dispatch(
      fetchComplaints()
    );

    toast.success(
      "Complaint submitted!"
    );

    // ✅ REDIRECT
    navigate("/citizen");

  } catch (err) {

    console.error(
      "SUBMIT ERROR:",
      err.response?.data ||
      err.message
    );

    toast.error(
      err.response?.data?.message ||
      "Error submitting complaint"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <Card className="mx-auto max-w-xl" padding="lg">

        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-foreground">
          <Rocket className="h-5 w-5 text-primary" />
          Civic Issue Reporter
        </h2>

        {/* UPLOAD */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Upload Issue Image
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
              className="mt-3 h-48 w-full rounded-lg object-cover"
            />
          )}
        </div>

        {/* AI RESULT */}
        {aiResult && (
          <div className="mb-5">
            <ResultCard
              result={aiResult}
            />
          </div>
        )}

        {/* LOCATION */}
        <div className="relative mb-5">
          <Input
            label="Location"
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
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-elevated">

              {suggestions.map(
                (
                  place,
                  index
                ) => (
                  <div
                    key={index}
                    className="cursor-pointer px-3.5 py-2.5 text-sm text-foreground hover:bg-elevated"
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
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-3.5 w-3.5" />
              {address}
            </p>
          )}

        </div>

        {/* MAP */}
        {location.lat &&
          location.lng && (
            <div className="mb-5 overflow-hidden rounded-xl">
              <MapView
                lat={location.lat}
                lng={location.lng}
              />
            </div>
          )}

        {/* TITLE */}
        <div className="mb-5">
          <Input
            label="Title"
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
        <div className="mb-6">
          <Textarea
            label="Description"
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
        <Button
          onClick={submitComplaint}
          loading={loading}
          size="lg"
          className="w-full"
        >
          {loading
            ? "Submitting..."
            : "Submit Complaint"}
        </Button>

      </Card>
    </div>
  );
}

export default ComplaintForm;
