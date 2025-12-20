"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreateCard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBg, setSelectedBg] = useState(null);
  const [font, setFont] = useState("Poppins");

  // Fetch backgrounds
  useEffect(() => {
    const fetchBackgrounds = async () => {
      const res = await fetch("/api/backgrounds");
      const data = await res.json();
      setBackgrounds(data);
    };
    fetchBackgrounds();
  }, []);

  // Generate image preview
  useEffect(() => {
    if (!image) return setPreview(null);
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Cloudinary upload
  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "momento");
    formData.append("folder", "Cards");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };


  const createCard = async () => {
    if (!title || !description || !image || !selectedBg) {
      return alert("All fields required ❗");
    }

    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary();

      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          image: imageUrl,
          background: selectedBg,
          font,
        }),
      });

      if (!res.ok) throw new Error("Create failed");

      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
      setSelectedBg(null);
      setFont("Poppins");
      router.push("/dashboard");
    } catch (err) {
      alert("Something went wrong ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Preview */}
      {preview && (
        <div className="flex justify-center">
          <Image
            src={preview}
            height={200}
            width={200}
            alt="previewImage"
            className="h-48 w-48 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full border p-2 rounded"
      />

      {/* Title Input */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`w-full p-2 rounded border text-lg`}
      />

      {/* Description Input */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={`w-full p-2 rounded border`}
        rows={4}
      />

      {/* Font Selector */}
      <div>
        <label className="block mb-1 font-medium">Select Font:</label>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Poppins">Poppins</option>
          <option value="Pacifico">Pacifico</option>
          <option value="Patua One">Patua One</option>
          <option value="Bebas Neue">Bebas Neue</option>
          <option value="Space Mono">Space Mono</option>
        </select>
      </div>

      {/* Background Selector */}
      <div>
        <h3 className="font-bold mb-2">Select Theme Background</h3>
        <div className="grid grid-cols-3 gap-4">
          {backgrounds.map((bg) => (
            <div
              key={bg._id}
              onClick={() => setSelectedBg(bg)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                selectedBg?._id === bg._id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              {bg.url.endsWith(".mp4") ? (
                <video
                  src={bg.url}
                  muted
                  loop
                  autoPlay
                  className="h-32 w-full object-cover"
                />
              ) : (
                <Image
                  src={bg.url}
                  width={200}
                  height={120}
                  alt={bg.name}
                  className="h-32 w-full object-cover"
                />
              )}
              <div className="p-2 text-sm">
                <p className="font-medium">{bg.name}</p>
                <p className="text-xs text-gray-500">{bg.theme.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={createCard}
        disabled={loading}
        className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        {loading ? "Creating..." : "Create Card"}
      </button>
    </div>
  );
}
