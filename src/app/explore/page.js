"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import EventCard from "@/Components/EventCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import Button from "@/Components/Button";
import Image from "next/image";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { Globe, Search, Sparkles } from "lucide-react";
import { isToday } from "date-fns";
import PublicEventCard from "@/Components/PublicEventCard";

const ExplorePublicEvents = () => {
  const { user, isLoaded } = useUser();
  const [publicEvents, setPublicEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/public`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setPublicEvents(data);
      } catch (error) {
        console.error("Explore fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicEvents();
  }, []);

  const filteredEvents = publicEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <MomentoLoader />
      </div>
    );

  return (
    <div className="overflow-hidden min-h-screen flex flex-col">
      <video
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-10 pointer-events-none"
        src="https://res.cloudinary.com/dxoxlurnt/video/upload/v1766266085/web_utfj0o.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Header same as Dashboard */}
      <header className="flex flex-row items-center justify-between px-4 md:px-14 py-6 md:py-10 gap-4">
        <Link href={"/"}>
          <Image
            src={"/momento.svg"}
            alt="Logo"
            height={40}
            width={150}
            className="h-9 w-auto"
          />
        </Link>
        <div className="flex gap-2 md:gap-5 items-center">
          <Link
            href={"/dashboard"}
            className="text-white/80 hover:text-white transition font-medium mr-3 md:block"
          >
            Dashboard
          </Link>
          <Dialog>
            <DialogTrigger>
              <Button label="Create" variant="light" />
            </DialogTrigger>
            <DialogContent className="bg-black text-white border-white/10">
              <DialogHeader>
                <DialogTitle>Create New</DialogTitle>
              </DialogHeader>
              <DialogDescription className="space-y-3 mt-4">
                <Link href="/create/event">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center hover:bg-white/10">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/event.png"
                        width={40}
                        height={40}
                        alt="E"
                        className="rounded-lg"
                      />
                      <div>
                        <h3 className="text-white font-bold">Event</h3>
                        <p className="text-xs">Collect RSVPs</p>
                      </div>
                    </div>
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                </Link>
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <UserButton />
        </div>
      </header>

      <main className="flex-grow px-4 md:px-14">
        {/* Title Section */}
        <div className="flex flex-col mb-10 gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/50">
              <Globe className="text-purple-400 w-6 h-6" />
            </div>
            <h1 className="font-bold text-3xl md:text-5xl tracking-tight">
              Explore Events
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover public gatherings, celebrations, and moments happening in
            the community.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by event title or city..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* The Responsive Grid */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-black/20 rounded-[3rem] border border-white/5 border-dashed">
            <div className="text-6xl mb-6 grayscale opacity-50">🏟️</div>
            <p className="text-xl font-bold text-white/40 uppercase tracking-widest">
              No ongoing events found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map((event) => (
              <div key={event._id} className="relative group">
                {/* Live Badge for events today */}
                {isToday(new Date(event.date)) && (
                  <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl animate-bounce">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE TODAY
                  </div>
                )}
                <div className="transform transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                  <PublicEventCard data={event} isExploreView={true} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t mt-10 border-white/10 p-12 bg-black/40 backdrop-blur-xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <Link href={"/"} className="flex gap-4 items-center">
          <Image
            src={"/momento.svg"}
            alt="Logo"
            height={24}
            width={120}
            className="opacity-80"
          />
          <span className="text-white/40 hidden md:inline">|</span>
          <h1 className="text-white/60 text-sm font-medium">
            Capture every moment.
          </h1>
        </Link>
        <div className="text-center md:text-right">
          <h1 className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">
            Architect
          </h1>
          <h1 className="text-xl text-white font-black tracking-tight">
            Siddharaj Gohil
          </h1>
        </div>
      </footer>
    </div>
  );
};

export default ExplorePublicEvents;
