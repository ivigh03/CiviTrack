import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ImagePlus, Sparkles } from "lucide-react";
import Button from "./ui/Button";

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

      return toast.error(
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

      // ❌ NO TOKEN
      if (!token) {

        toast.error(
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

      // ✅ SAVE RESULT
      setResult({
        ...res.data.data,
        file,
      });

      toast.success("Image analyzed!");

    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err.response?.data ||
        err.message
      );

      toast.error(

        err.response?.data
          ?.message ||

        "Error analyzing image"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="rounded-xl border border-dashed border-border bg-elevated/50 p-5">

      <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          <ImagePlus className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-foreground">
          {file ? file.name : "Click to upload an image"}
        </span>
        <span className="text-xs text-muted">PNG, JPG up to a few MB</span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            handleFile(
              e.target.files[0]
            )
          }
        />
      </label>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-4 h-48 w-full rounded-lg object-cover"
        />
      )}

      <Button
        type="button"
        onClick={handleUpload}
        loading={loading}
        variant="secondary"
        className="mt-4 w-full"
      >
        <Sparkles className="h-4 w-4" />
        {loading ? "Analyzing..." : "Analyze Image"}
      </Button>

    </div>
  );
}
