"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function CreateEvent() {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBg, setSelectedBg] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const res = await fetch("/api/backgrounds");
      const data = await res.json();
      setBackgrounds(data);
    };
    fetchBackgrounds();
  }, []);

  useEffect(() => {
    if (!coverImage) return setPreview(null);
    const url = URL.createObjectURL(coverImage);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", coverImage);
    formData.append("upload_preset", "momento");
    formData.append("folder", "Events");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const addSection = () =>
    setSections([...sections, { heading: "", description: "" }]);
  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };
  const removeSection = (index) =>
    setSections(sections.filter((_, i) => i !== index));

  const createEvent = async () => {
    if (!title || !description || !date || !location || !coverImage)
      return alert("All fields required ❗");

    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary();
      const slug = title.toLowerCase().replace(/\s+/g, "-"); // simple slug

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          location,
          coverImage: imageUrl,
          slug,
          host: { name: user.fullName, avatar: user.imageUrl, id: user.id },
          font: { heading: "Playfair_Display", body: "Inter" },
          background: { primary: "#fff", secondary: "#f2f2f2" },
          rsvp: true,
          sections,
          userId: user.id,
          background: selectedBg,
        }),
      });

      if (!res.ok) throw new Error("Event creation failed");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-xl">
      {preview && (
        <Image
          src={preview}
          width={400}
          height={300}
          alt="Preview"
          className="rounded-lg mb-4"
        />
      )}
      <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} />

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full my-2"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full my-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="block w-full my-2"
      />
      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="block w-full my-2"
      />

      <h3 className="mt-4 font-semibold">Sections</h3>
      {sections.map((sec, i) => (
        <div key={i} className="border p-2 my-2">
          <input
            placeholder="Heading"
            value={sec.heading}
            onChange={(e) => updateSection(i, "heading", e.target.value)}
            className="block w-full my-1"
          />
          <textarea
            placeholder="Description"
            value={sec.description}
            onChange={(e) => updateSection(i, "description", e.target.value)}
            className="block w-full my-1"
          />
          <button
            onClick={() => removeSection(i)}
            className="text-red-500 mt-1"
          >
            Remove Section
          </button>
        </div>
      ))}
      <button onClick={addSection} className="bg-gray-200 px-3 py-1 mt-2">
        Add Section
      </button>

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
                <p className="text-xs text-gray-500">
                  {bg.theme.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={createEvent}
        disabled={loading}
        className="block bg-blue-500 text-white px-4 py-2 mt-4"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </div>
  );
}
