"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Spinner } from "@/Components/ui/spinner";
import fonts from "@/Fonts";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function EditCard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { slug } = useParams(); // Get slug from the URL

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // The new file object if user changes it
  const [preview, setPreview] = useState(null); // The URL displayed in the UI
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBg, setSelectedBg] = useState(null);
  const [font, setFont] = useState("Poppins");

  // 1. Fetch Backgrounds and Existing Card Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        
        // Fetch All Backgrounds
        const bgRes = await fetch("/api/backgrounds");
        const bgData = await bgRes.json();
        setBackgrounds(bgData);

        // Fetch Specific Card Data by Slug
        const cardRes = await fetch(`/api/cards/${slug}`);
        if (!cardRes.ok) throw new Error("Card not found");
        
        const cardData = await cardRes.json();
        
        // Pre-fill the form with existing data
        setTitle(cardData.title);
        setDescription(cardData.description);
        setPreview(cardData.image); // Set initial preview to existing image URL
        setSelectedBg(cardData.background);
        setFont(cardData.font || "Poppins");
        
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load card data ❌");
      } finally {
        setFetching(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  // 2. Handle Local Image Preview (when user selects a NEW file)
  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const uploadToCloudinary = async () => {
    // If 'image' is null, user didn't change the photo. Return existing preview URL.
    if (!image) return preview;

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

  const updateCard = async () => {
    if (!title || !description || !selectedBg) {
      return toast.error("Please fill in all fields!");
    }

    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary();

      const res = await fetch(`/api/cards/${slug}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          image: imageUrl,
          background: selectedBg,
          font: font,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Card updated successfully! 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950">
        <Spinner />
      </div>
    );
  }

  return (
    <main
      className={`relative overflow-hidden min-h-screen w-full flex flex-col items-center justify-center p-6 lg:p-12 transition-colors duration-500 ${
        selectedBg?.theme === "dark" ? "text-black" : "text-white"
      }`}
    >
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {selectedBg?.url.endsWith(".mp4") ? (
          <video
            key={selectedBg.url}
            src={selectedBg.url}
            autoPlay muted loop playsInline
            className="w-screen h-screen object-cover"
          />
        ) : selectedBg ? (
          <Image
            src={selectedBg.url}
            alt="bg"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        {/* LEFT COLUMN: PREVIEW */}
        <div className="flex flex-col items-center gap-8 lg:sticky lg:top-10">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md py-2 px-4 rounded-full border border-white/20">
            <span className="text-sm opacity-80">Editing Card from</span>
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                height={32}
                width={32}
                className="rounded-full border border-white/40"
                alt="Profile"
              />
            )}
            <b className="text-sm md:text-base">{user?.fullName || "Guest"}</b>
          </div>

          <div className="relative group mr-5 mt-5">
            <div className="relative z-10 transition-transform duration-500 hover:rotate-0 -rotate-6">
              <Image
                src={preview || "/previewCard.png"}
                height={400}
                width={400}
                alt="preview"
                className="h-64 w-64 md:h-80 md:w-80 rounded-2xl object-cover shadow-2xl border-4 border-white"
              />
              <label
                htmlFor="card-upload"
                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold text-sm"
              >
                Change Photo
              </label>
            </div>
            <input
              id="card-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS */}
        <div className="w-full max-w-md flex flex-col gap-6 bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="space-y-4">
            <input
              placeholder="Edit Title"
              value={title}
              style={{ fontFamily: font }}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-3xl md:text-4xl font-bold text-center border-b border-white/20 pb-2 outline-none focus:border-white transition-colors"
            />

            <textarea
              placeholder="Update your message..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/10 p-4 rounded-xl text-center text-lg border border-white/10 outline-none focus:bg-white/20 transition-all resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">
              Typography
            </label>
            <Select value={font} onValueChange={(value) => setFont(value)}>
              <SelectTrigger
                className="w-full h-12 bg-white/10 border-white/20 rounded-xl backdrop-blur-md mt-3"
                style={{ fontFamily: font }}
              >
                <SelectValue placeholder="Choose a Font" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10 text-white">
                {fonts.map((f) => (
                  <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">
              Change Theme Background
            </label>
            <div className="flex flex-wrap mt-3 gap-3 justify-start">
              {backgrounds.map((bg) => (
                <button
                  key={bg._id}
                  onClick={() => setSelectedBg(bg)}
                  className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                    selectedBg?._id === bg._id
                      ? "border-white scale-110 shadow-lg"
                      : "border-transparent"
                  }`}
                >
                  {bg.url.endsWith(".mp4") ? (
                    <video
                      src={bg.url}
                      muted
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={bg.url}
                      className="h-full w-full object-cover"
                      alt={bg.name}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={updateCard}
            disabled={loading}
            className="w-full cursor-pointer py-4 mt-2 bg-white text-black font-black text-lg rounded-xl hover:bg-neutral-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Saving Changes...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}