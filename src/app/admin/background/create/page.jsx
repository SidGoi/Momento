"use client";

import { useState } from "react";
import Image from "next/image";

export default function AddBackground() {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("light");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔼 Upload to Cloudinary (Image OR Video)
  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "momentoBG");
    formData.append("folder", "Backgrounds");


    const resourceType = file.type.startsWith("video") ? "video" : "image";

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const createBackground = async () => {
    if (!name || !file) {
      return alert("Name & file required ❗");
    }

    try {
      setLoading(true);

      const url = await uploadToCloudinary();

      const res = await fetch("/api/backgrounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          theme,
          url,
        }),
      });

      if (!res.ok) throw new Error("Create failed");

      alert("Background added successfully ✅");
      setName("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      alert("Only admin can add background ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-8 space-y-4">
      <h1 className="text-2xl font-bold">Add Background</h1>

      {/* Preview */}
      {preview && (
        <div className="rounded-lg overflow-hidden">
          {file?.type.startsWith("video") ? (
            <video
              src={preview}
              autoPlay
              loop
              muted
              className="w-full h-48 object-cover"
            />
          ) : (
            <Image
              src={preview}
              width={400}
              height={300}
              alt="preview"
              className="w-full h-48 object-cover"
            />
          )}
        </div>
      )}

      {/* Name */}
      <input
        type="text"
        placeholder="Background Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Theme Dropdown */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="light">Light Theme</option>
        <option value="dark">Dark Theme</option>
      </select>

      {/* File Upload */}
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const f = e.target.files[0];
          setFile(f);
          setPreview(URL.createObjectURL(f));
        }}
      />

      {/* Submit */}
      <button
        onClick={createBackground}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Uploading..." : "Add Background"}
      </button>
    </div>
  );
}
