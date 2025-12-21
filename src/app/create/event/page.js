"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Spinner } from "@/Components/ui/spinner";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { Switch } from "@/Components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";

export default function CreateEvent() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [font, setFont] = useState("Poppins");
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBg, setSelectedBg] = useState(null);
  const [sections, setSections] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("18:00");

  // State to control Popover open/close
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Transparent Input Styles
  const glassInputClass =
    "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all";

  useEffect(() => {
    if (isLoaded && !user) router.push("/sign-up");
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetch("/api/backgrounds")
      .then((res) => res.json())
      .then((data) => {
        setBackgrounds(data);
        if (data?.length) setSelectedBg(data[0]);
      });
  }, []);

  useEffect(() => {
    if (!coverImage) return;
    const url = URL.createObjectURL(coverImage);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  const addSection = () =>
    setSections([...sections, { heading: "", description: "" }]);

  const updateSection = (i, field, value) => {
    const copy = [...sections];
    copy[i][field] = value;
    setSections(copy);
  };

  const removeSection = (i) =>
    setSections(sections.filter((_, idx) => idx !== i));

  const createEvent = async () => {
    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !location ||
      !coverImage ||
      !selectedBg
    ) {
      toast.error("All fields required!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", coverImage);
      formData.append("upload_preset", "momento");
      formData.append("folder", "Events");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const uploadData = await uploadRes.json();
      const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          userId: user.id,
          title,
          description,
          date,
          time,
          location,
          coverImage: uploadData.secure_url,
          host: { name: user.fullName, avatar: user.imageUrl, id: user.id },
          font: { heading: font, body: "Inter" },
          background: {
            name: selectedBg.name,
            theme: selectedBg.theme,
            url: selectedBg.url,
          },
          rsvp: true,
          sections,
          commentsEnabled,
          isPublic,
        }),
      });

      if (!res.ok) throw new Error("Event creation failed");
      toast.success("Event Created Successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <MomentoLoader />;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-x-hidden">
      {/* 🌌 Background */}
      <div className="fixed inset-0 -z-10">
        {selectedBg?.url?.endsWith(".mp4") ? (
          <video
            src={selectedBg.url}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : selectedBg ? (
          <Image
            src={selectedBg.url}
            fill
            className="object-cover"
            alt="bg"
            priority
          />
        ) : (
          <div className="bg-neutral-900 w-full h-full" />
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* 🖼 LEFT – Preview (Sticky on desktop) */}
        <div className="flex flex-col items-center gap-6 lg:sticky lg:top-10 w-full lg:w-1/2">
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur text-white">
            <span className="text-sm">Hosted by</span>
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                width={30}
                height={30}
                className="rounded-full"
                alt="host"
              />
            )}
            <b className="text-sm md:text-base">{user?.fullName}</b>
          </div>

          <div className="relative w-full max-w-[400px]">
            <Image
              src={preview || "/previewCard.png"}
              width={400}
              height={400}
              alt="preview"
              className="rounded-3xl border-4 border-white/30 shadow-2xl object-cover aspect-square w-full"
            />
            <label
              htmlFor="cover-upload"
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all font-semibold text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="currentColor"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h295q20 0 30.5 16.5T529-788q-5 17-7 34t-2 34q0 100 70 170t170 70q8 0 17-.5t17-2.5q18-2 32 9t14 28v246q0 33-23.5 56.5T760-120H200Zm80-160h400q12 0 18-11t-2-21L586-459q-6-8-16-8t-16 8L450-320l-74-99q-6-8-16-8t-16 8l-80 107q-8 10-2 21t18 11Z" />
              </svg>
              Change Photo
            </label>
            <input
              id="cover-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </div>

          <div className="w-full space-y-3 text-white max-w-[450px]">
            <input
              placeholder="Add a Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/10 p-4 rounded-xl text-center text-xl md:text-2xl font-black border border-white/10 outline-none focus:bg-white/20 transition-all"
              style={{ fontFamily: font }}
            />
            <textarea
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/10 p-4 rounded-xl text-center text-base md:text-lg border border-white/10 outline-none focus:bg-white/20 transition-all resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* 🎛 RIGHT – Controls */}
        <div className="w-full lg:w-[450px] bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-medium h-12 rounded-xl ${glassInputClass}`}
                >
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setCalendarOpen(false); // Closes on select
                  }}
                  initialFocus
                  className="bg-gray-800 text-white rounded-md"
                />
              </PopoverContent>
            </Popover>

            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`h-12 rounded-xl ${glassInputClass}`}
            />
          </div>

          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`h-12 rounded-xl ${glassInputClass}`}
          />

          {/* Typography */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 ml-1">
              Typography
            </label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger
                className={`w-full h-12 rounded-xl ${glassInputClass}`}
                style={{ fontFamily: font }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 text-white border-white/10">
                {["Poppins", "Pacifico", "Bebas Neue", "Space Mono"].map(
                  (f) => (
                    <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                      {f}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Background */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 ml-1">
              Theme Background
            </label>
            <div className="flex flex-wrap gap-3">
              {backgrounds.map((bg) => (
                <button
                  key={bg._id}
                  onClick={() => setSelectedBg(bg)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    selectedBg?._id === bg._id
                      ? "border-white scale-110 shadow-lg"
                      : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  {bg.url.endsWith(".mp4") ? (
                    <video
                      src={bg.url}
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={bg.url}
                      className="w-full h-full object-cover"
                      alt="option"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <Label htmlFor="comment" className="cursor-pointer font-medium">
                Enable Comments
              </Label>
              <Switch
                id="comment"
                checked={commentsEnabled}
                onCheckedChange={setCommentsEnabled}
                className="
    data-[state=checked]:bg-purple-500 
    data-[state=unchecked]:bg-white/20
  "
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex flex-col">
                <Label htmlFor="public" className="cursor-pointer font-medium">
                  Make it Public
                </Label>
                <span className="text-[10px] opacity-50">
                  Visible on global explore
                </span>
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                className="
    data-[state=checked]:bg-purple-500 
    data-[state=unchecked]:bg-white/20
  "
              />
            </div>
          </div>

          {/* Sections Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-xs uppercase tracking-widest opacity-60">
                Event Sections
              </h3>
              <Button
                onClick={addSection}
                size="sm"
                className="h-7 text-[10px] bg-white/20 hover:bg-white/30 text-white rounded-full"
              >
                + ADD SECTION
              </Button>
            </div>
            <div className="max-h-[180px] overflow-y-auto space-y-5 mt-5 z-10 pr-2 custom-scrollbar">
              {sections.map((sec, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-3 mt-3 rounded-2xl border border-white/10 space-y-2 relative group animate-in fade-in slide-in-from-top-1"
                >
                  <Input
                    placeholder="Heading"
                    value={sec.heading}
                    onChange={(e) =>
                      updateSection(i, "heading", e.target.value)
                    }
                    className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 font-bold placeholder:text-white/30"
                  />
                  <Textarea
                    placeholder="Details..."
                    value={sec.description}
                    onChange={(e) =>
                      updateSection(i, "description", e.target.value)
                    }
                    className="bg-transparent border-none p-0 focus-visible:ring-0 text-sm resize-none min-h-[40px] placeholder:text-white/30"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity scale-75"
                    onClick={() => removeSection(i)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={createEvent}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl hover:bg-neutral-200 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Creating...
              </span>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
