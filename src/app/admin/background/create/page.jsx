"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/Components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function AddBackground() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("light");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle local preview cleanup
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "momentoBG");
    formData.append("folder", "Backgrounds");

    // Dynamic resource type based on file type
    const resourceType = file.type.startsWith("video") ? "video" : "image";

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const createBackground = async () => {
    if (!name || !file) {
      return toast.error("Background name and file are required! ❗");
    }

    try {
      setLoading(true);
      const url = await uploadToCloudinary();

      const res = await fetch("/api/backgrounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme, url }),
      });

      if (!res.ok) throw new Error("Create failed");

      toast.success("Background added to library! 🎉");
      router.push("/admin/"); // Redirect back to list
    } catch (err) {
      toast.error("Error: Only admins can perform this action ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 lg:p-12">
      {/* Back Button */}
      <Link 
        href="/admin/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
        </svg>
        Back to Library
      </Link>

      <div className="z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT: PREVIEW PANEL */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center group transition-all hover:border-white/20">
            {preview ? (
              file?.type.startsWith("video") ? (
                <video src={preview} autoPlay loop muted className="w-full h-full object-cover" />
              ) : (
                <Image src={preview} fill alt="preview" className="object-cover" />
              )
            ) : (
              <div className="text-center space-y-2 opacity-40">
                <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
                </svg>
                <p className="text-sm font-medium">No file selected</p>
              </div>
            )}
            
            <label 
              htmlFor="bg-upload" 
              className="absolute inset-0 cursor-pointer z-20"
            />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Asset Preview</p>
        </div>

        {/* RIGHT: CONTROLS PANEL */}
        <div className="w-full bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Add New Library Item</h2>
            <p className="text-gray-400 text-sm">Upload a premium background asset for the card creator.</p>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Asset Name</label>
              <input
                type="text"
                placeholder="e.g., Golden Sparkles"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-white/40 transition-all"
              />
            </div>

            {/* Theme Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Overlay Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full h-14 bg-white/5 border-white/10 rounded-2xl">
                  <SelectValue placeholder="Select Text Contrast" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white">
                  <SelectItem value="light">Light (For dark backgrounds)</SelectItem>
                  <SelectItem value="dark">Dark (For light backgrounds)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hidden File Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Source File</label>
              <input
                id="bg-upload"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={createBackground}
            disabled={loading}
            className="w-full py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-neutral-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner className="text-black" />
                <span>Publishing...</span>
              </>
            ) : (
              "Add to Library"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}