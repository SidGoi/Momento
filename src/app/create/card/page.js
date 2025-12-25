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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CreateCard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBg, setSelectedBg] = useState(null);
  const [font, setFont] = useState("Poppins");

  if (!user) {
    router.push("/auth/signup"); // or "/sign-in"
  }

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const res = await fetch("/api/backgrounds");
        const data = await res.json();
        setBackgrounds(data);
        if (data.length > 0) setSelectedBg(data[0]);
      } catch (err) {
        console.error("Failed to fetch backgrounds", err);
      }
    };
    fetchBackgrounds();
  }, []);

  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

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
      return toast.error("Please fill in all fields including an image!");
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
          font: font,
        }),
      });

      if (!res.ok) throw new Error("Create failed");
      toast.success("Card created successfully! 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

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
            autoPlay
            muted
            loop
            playsInline
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
        <div className="absolute inset-0 bg-black/20" />{" "}
        {/* Subtle overlay for legibility */}
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        {/* LEFT COLUMN: PREVIEW */}
        <div className="flex flex-col  items-center gap-8 lg:sticky lg:top-10">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md py-2 px-4 rounded-full border border-white/20">
            <span className="text-sm opacity-80">From</span>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#111"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h298q20 0 30.5 17.5T531-785q-5 16-8 32t-3 33q0 83 58.5 141.5T720-520q17 0 33-3t32-8q20-7 37.5 3t17.5 30v298q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm480-320q-17 0-28.5-11.5T680-640v-40h-40q-17 0-28.5-11.5T600-720q0-17 11.5-28.5T640-760h40v-40q0-17 11.5-28.5T720-840q17 0 28.5 11.5T760-800v40h40q17 0 28.5 11.5T840-720q0 17-11.5 28.5T800-680h-40v40q0 17-11.5 28.5T720-600Z" />
                </svg>
                Change Photo
              </label>
            </div>
            <Image
              src="/envelope.png"
              alt="envelope"
              height={300}
              width={300}
              className="absolute -top-10 -right-20 h-72 w-72 md:h-80 md:w-80 rotate-12 opacity-80 -z-10 object-contain group-hover:rotate-12 transition-transform"
            />
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
              placeholder="Add a Title"
              value={title}
              style={{ fontFamily: font }}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-3xl md:text-4xl font-bold text-center border-b border-white/20 pb-2 outline-none focus:border-white transition-colors"
            />

            <textarea
              placeholder="Write your message..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/10 p-4 rounded-xl text-center text-lg border border-white/10 outline-none focus:bg-white/20 transition-all resize-none"
              rows={3}
            />
          </div>

          <div className="">
            <label className="text-xs font-bold">Typography</label>
            <Select value={font} onValueChange={(value) => setFont(value)}>
              <SelectTrigger
                className="w-full h-12 bg-white/10 border-white/20 rounded-xl backdrop-blur-md mt-3"
                style={{ fontFamily: font }}
              >
                <SelectValue placeholder="Choose a Font" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-white/10 text-white">
                {fonts.map(
                  (f) => (
                    <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                      {f}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <label className="text-xs font-bold">Theme Background</label>
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
            onClick={createCard}
            disabled={loading}
            className="w-full cursor-pointer py-4 mt-2 bg-white text-black font-black text-lg rounded-xl hover:bg-neutral-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Creating Card
              </span>
            ) : (
              "Create Card"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
