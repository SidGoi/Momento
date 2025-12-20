"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
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
  const [preview, setPreview] = useState("/Cards/img1.jpg");
  const [loading, setLoading] = useState(false);

  // 1. Initial state for the list of backgrounds
  const [backgrounds, setBackgrounds] = useState([]);
  // 2. State for the currently ACTIVE background
  const [selectedBg, setSelectedBg] = useState(null);
  const [font, setFont] = useState("Poppins");

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const res = await fetch("/api/backgrounds");
        const data = await res.json();
        setBackgrounds(data);
        // Set the first background as default so the screen isn't empty
        if (data.length > 0) setSelectedBg(data[0]);
      } catch (err) {
        console.error("Failed to fetch backgrounds", err);
      }
    };
    fetchBackgrounds();
  }, []);

  useEffect(() => {
    if (!image) return setPreview(null);
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
          font: font,
        }),
      });

      if (!res.ok) throw new Error("Create failed");
      toast.success("Card created successfully! 🎉", {
        description: "Redirecting you to your dashboard...",
      });
      router.push("/dashboard");
    } catch (err) {
      alert("Something went wrong ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center ${
        selectedBg?.theme === "dark" ? "text-black" : "text-white"
      }`}
    >
      {selectedBg && selectedBg.url.endsWith(".mp4") ? (
        <video
          key={selectedBg.url} // Key forces video to re-render when URL changes
          src={selectedBg.url}
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
        />
      ) : selectedBg ? (
        <Image
          src={selectedBg.url}
          alt="bg"
          fill
          className="fixed inset-0 object-cover -z-10"
        />
      ) : (
        <div className="fixed inset-0 bg-black -z-10" />
      )}

      <div className="flex  flex-col items-center justify-center gap-5 p-10">
        <div className="flex items-center gap-4 text-xl">
          <span>From</span>
          <div className="flex items-center justify-center gap-2">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                height={40}
                width={40}
                className="h-8 w-8 rounded-full object-cover"
                alt={user.fullName || "User Profile"}
              />
            )}
            <b className="text-sm md:text-lg">{user?.fullName || "Guest"}</b>
          </div>
        </div>

        <div className="relative my-10 pr-10">
          <Image
            src={preview || "/Cards/img5.jpg"}
            height={200}
            width={200}
            alt="previewImage"
            className="h-80 w-80 rounded-2xl -rotate-12"
          />
          <input
            id="card-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden w-fit absolute bottom-10 -rotate-12 bg-white p-3 rounded-xl border text-black-1 z-10"
          />

          <label
            htmlFor="card-upload"
            className="flex absolute bottom-10 right-10 -rotate-12 items-center justify-center w-fit rounded-full gap-2 px-5  cursor-pointer z-10 py-2 bg-white text-black transition-all duration-100
               hover:bg-gray-100 hover:scale-105 
               active:bg-gray-200 active:scale-95 font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#111"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h295q20 0 30.5 16.5T529-788q-5 17-7 34t-2 34q0 100 70 170t170 70q8 0 17-.5t17-2.5q18-2 32 9t14 28v246q0 33-23.5 56.5T760-120H200Zm80-160h400q12 0 18-11t-2-21L586-459q-6-8-16-8t-16 8L450-320l-74-99q-6-8-16-8t-16 8l-80 107q-8 10-2 21t18 11Zm480-280q-17 0-28.5-11.5T720-600v-127l-36 35q-11 11-27.5 11.5T628-692q-11-11-11-28t11-28l104-104q6-6 13-9t15-3q8 0 15 3t13 9l104 104q11 11 11.5 27.5T892-692q-11 11-28 11t-28-11l-36-35v127q0 17-11.5 28.5T760-560Z" />
            </svg>{" "}
            Change Image
          </label>

          <Image
            src="/envelope.png"
            alt="envelope"
            height={300}
            width={300}
            className="h-auto rotate-6 w-70 absolute top-0 -z-1 -right-10 object-contain"
          />
        </div>

        <div className="flex flex-col gap-3">
          <input
            placeholder="Add a Title"
            value={title}
            style={{ fontFamily: font }}
            onChange={(e) => setTitle(e.target.value)}
            className="w-100 p-3 rounded-xl text-5xl text-center duration-200 transition bg-white/30 hover:bg-white/20 border border-white/10  outline-none"
          />

          <textarea
            placeholder="Write your message..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="full p-3 w-100 rounded-xl text-lg text-center duration-200 transition bg-white/30 hover:bg-white/20 border border-white/10  outline-none "
            rows={3}
          />

          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold opacity-80 uppercase tracking-wider ml-1">
              Select Font
            </label>

            <Select value={font} onValueChange={(value) => setFont(value)}>
              <SelectTrigger
                className="w-full h-12 bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-md focus:ring-blue-500/50"
                style={{ fontFamily: font }}
              >
                <SelectValue placeholder="Choose a Font" />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white rounded-xl">
                <SelectItem
                  value="Poppins"
                  style={{ fontFamily: "Poppins" }}
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  Poppins
                </SelectItem>
                <SelectItem
                  value="Pacifico"
                  style={{ fontFamily: "Pacifico" }}
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  Pacifico (Cursive)
                </SelectItem>
                <SelectItem
                  value="Bebas Neue"
                  style={{ fontFamily: "Bebas Neue" }}
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  Bebas Neue (Bold)
                </SelectItem>
                <SelectItem
                  value="Space Mono"
                  style={{ fontFamily: "Space Mono" }}
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  Space Mono (Tech)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-bold mb-5">Select Theme Background</h3>
            <div className="flex gap-3">
              {backgrounds.map((bg) => (
                <div
                  key={bg._id}
                  onClick={() => setSelectedBg(bg)}
                  className={`cursor-pointer w-20 h-20 overflow-hidden border-2 transition-all duration-150 ${
                    selectedBg?._id === bg._id
                      ? "border-white rounded-full w-20 h-20"
                      : "border-transparent rounded-full"
                  }`}
                >
                  {bg.url.endsWith(".mp4") ? (
                    <video
                      src={bg.url}
                      muted
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={bg.url}
                      className="h-20 w-20 rounded-full object-cover"
                      alt={bg.name}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={createCard}
            disabled={loading}
            className="w-full py-4 mt-4 bg-white text-black font-bold rounded-2xl hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Card"}
          </button>
        </div>
      </div>
    </main>
  );
}
