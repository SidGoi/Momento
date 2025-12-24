"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Spinner } from "@/Components/ui/spinner";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { Switch } from "@/Components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";

export default function EditEvent() {
  const router = useRouter();
  const { slug } = useParams();
  const { user, isLoaded } = useUser();

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [font, setFont] = useState("Poppins");
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBg, setSelectedBg] = useState(null);
  const [sections, setSections] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("18:00");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [host, setHost] = useState([])

  const glassInputClass = "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all";

  // 1. Fetch Backgrounds and Event Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Backgrounds
        const bgRes = await fetch("/api/backgrounds");
        const bgData = await bgRes.json();
        setBackgrounds(bgData);

        // Fetch Existing Event Details
        const eventRes = await fetch(`/api/events/${slug}`);
        if (!eventRes.ok) throw new Error("Event not found");
        const event = await eventRes.json();

        // Populate States
        setHost(event.host)
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setPreview(event.coverImage);
        setCommentsEnabled(event.commentsEnabled);
        setIsPublic(event.isPublic);
        setFont(event.font?.heading || "Poppins");
        setSections(event.sections || []);
        setDate(new Date(event.date));
        setTime(event.time);

        // Match Background
        const currentBg = bgData.find(b => b.name === event.background.name);
        setSelectedBg(currentBg || bgData[0]);

      } catch (err) {
        console.error(err);
        alert("Could not load event data");
      } finally {
        setFetching(false);
      }
    };

    if (isLoaded && user) fetchData();
    else if (isLoaded && !user) router.push("/sign-up");
  }, [isLoaded, user, slug, router]);

  // Handle Cover Image Preview
  useEffect(() => {
    if (!coverImage) return;
    const url = URL.createObjectURL(coverImage);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  const addSection = () => setSections([...sections, { heading: "", description: "" }]);
  const updateSection = (i, field, value) => {
    const copy = [...sections];
    copy[i][field] = value;
    setSections(copy);
  };
  const removeSection = (i) => setSections(sections.filter((_, idx) => idx !== i));

  const updateEvent = async () => {
    // Basic Validation
    if (!title || !date || !location) {
      toast.error("Please fill in the required fields ❗");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = preview;

      // 1. Handle Image Upload if changed
      if (coverImage) {
        const formData = new FormData();
        formData.append("file", coverImage);
        formData.append("upload_preset", "momento");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      }

      // 2. Update Database
      const res = await fetch(`/api/events/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          time,
          location,
          coverImage: imageUrl,
          font: { heading: font, body: "Inter" },
          background: {
            name: selectedBg.name,
            theme: selectedBg.theme,
            url: selectedBg.url,
          },
          sections,
          commentsEnabled,
          isPublic,
        }),
      });

      if (!res.ok) throw new Error("Failed to update event");

      // SUCCESS TOAST 🎉
      toast.success("Event updated successfully!", {
        description: "Your changes are now live.",
      });

      // Redirect after a short delay so they see the toast
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (err) {
      console.error(err);
      // ERROR TOAST ❌
      toast.error("Update failed", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || fetching) return <MomentoLoader />;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-x-hidden">
      {/* 🌌 Background (Same as Create) */}
      <div className="fixed inset-0 -z-10">
        {selectedBg?.url?.endsWith(".mp4") ? (
          <video src={selectedBg.url} autoPlay loop muted className="w-screen h-screen object-cover" />
        ) : (
          <Image src={selectedBg?.url || "/default-bg.jpg"} fill className="object-cover" alt="bg" priority />
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* LEFT – Preview */}
        <div className="flex flex-col items-center gap-6 lg:sticky lg:top-10 w-full lg:w-1/2">
          <div className="animate-sender flex items-center gap-3 bg-black/10 backdrop-blur-md px-8 py-2 rounded-full border border-white/10">
            <span className="text-sm opacity-80">From</span>
            <Image src={host.avatar} height={40} width={40} className="h-8 w-8 rounded-full object-cover border border-white/20" alt="host" />
            <b className="text-lg">{host.name}</b>
          </div>


          <div className="relative w-full max-w-[400px]">
            <Image src={preview || "/previewCard.png"} width={400} height={400} alt="preview" className="rounded-3xl border-4 border-white/30 shadow-2xl object-cover aspect-square w-full" />
            <label htmlFor="cover-upload" className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full cursor-pointer shadow-lg hover:scale-105 transition-all font-semibold text-sm">
              Change Photo
            </label>
            <input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
          </div>

          <div className="w-full space-y-3 text-white max-w-[450px]">
            <input placeholder="Add a Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-center text-xl md:text-2xl font-black border border-white/10 outline-none" style={{ fontFamily: font }} />
            <textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-center text-base border border-white/10 outline-none resize-none" rows={3} />
          </div>
        </div>

        {/* RIGHT – Controls (Same as Create) */}
        <div className="w-full lg:w-[450px] bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`w-full justify-start text-left h-12 rounded-xl ${glassInputClass}`}>
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setCalendarOpen(false); }} className="bg-gray-800 text-white" />
              </PopoverContent>
            </Popover>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`h-12 rounded-xl ${glassInputClass}`} />
          </div>

          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className={`h-12 rounded-xl ${glassInputClass}`} />

          {/* Typography & Backgrounds Selectors (Copy from CreateEvent) */}
          {/* ... (Keep the Select and Background loop logic same as CreateEvent) */}

          <div className="space-y-3">
            {/* Comments & Public Switches (Same as CreateEvent) */}
          </div>

          <div className="space-y-4">
            {/* Sections Management (Same as CreateEvent) */}
          </div>

          <button
            onClick={updateEvent}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl hover:bg-neutral-200 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Updating...
              </span>
            ) : (
              "Update Event"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}