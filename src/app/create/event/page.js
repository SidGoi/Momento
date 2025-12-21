"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { format } from "date-fns";
import { CalendarDays, MapPin, MessageSquare, Lock } from "lucide-react";

export default function EventViewPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    // Fetch event data by slug
    fetch(`/api/events/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading || !isLoaded) return <MomentoLoader />;
  if (!event) return <div className="text-white text-center mt-20">Event not found</div>;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-x-hidden">
      {/* 🌌 Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        {event.background?.url?.endsWith(".mp4") ? (
          <video src={event.background.url} autoPlay loop muted className="w-full h-full object-cover" />
        ) : (
          <Image src={event.background?.url || "/default-bg.jpg"} fill className="object-cover" alt="bg" priority />
        )}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* 🖼 LEFT – Event Details (Sticky) */}
        <div className="flex flex-col items-center gap-6 lg:sticky lg:top-10 w-full lg:w-1/2">
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur text-white">
            <span className="text-sm opacity-70">Hosted by</span>
            {event.host?.avatar && (
              <Image src={event.host.avatar} width={30} height={30} className="rounded-full" alt="host" />
            )}
            <b className="text-sm md:text-base">{event.host?.name}</b>
          </div>

          <div className="relative w-full max-w-[450px]">
            <Image
              src={event.coverImage}
              width={500}
              height={500}
              alt="event cover"
              className="rounded-[2.5rem] border-4 border-white/20 shadow-2xl object-cover aspect-square w-full"
            />
          </div>

          <div className="w-full space-y-4 text-white text-center lg:text-left max-w-[500px]">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: event.font?.heading }}>
              {event.title}
            </h1>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed font-light">
              {event.description}
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <CalendarDays className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">
                  {format(new Date(event.date), "PPP")} @ {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 💬 RIGHT – Interactive Panel (RSVP & Comments) */}
        <div className="w-full lg:w-[450px] space-y-6">
          
          {/* RSVP Card */}
          <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-white">
            <h3 className="text-xl font-bold mb-4">Are you coming?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-white text-black hover:bg-neutral-200 rounded-2xl h-14 font-bold text-lg">
                Going
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/10 rounded-2xl h-14 font-bold text-lg text-white">
                Maybe
              </Button>
            </div>
          </div>

          {/* Additional Sections */}
          {event.sections?.map((sec, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 text-white">
              <h4 className="font-bold text-purple-400 uppercase tracking-widest text-xs mb-2">{sec.heading}</h4>
              <p className="opacity-80 text-sm leading-relaxed">{sec.description}</p>
            </div>
          ))}

          {/* Comments Section */}
          {event.commentsEnabled && (
            <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl text-white">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 opacity-60" />
                <h3 className="font-bold uppercase tracking-widest text-xs opacity-60">Guestbook</h3>
              </div>

              <div className="relative">
                {/* Blur Overlay for Signed Out Users */}
                {!isSignedIn && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-center p-4">
                    <Lock className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-bold mb-3">Sign in to leave a message</p>
                    <SignInButton mode="modal">
                      <Button size="sm" className="bg-white text-black rounded-full font-bold">Sign In</Button>
                    </SignInButton>
                  </div>
                )}

                {/* Comment Input (Hidden if signed out) */}
                {isSignedIn && (
                  <div className="space-y-3 mb-6">
                    <Textarea 
                      placeholder="Write a sweet note..."
                      className="bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all resize-none min-h-[100px]"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button className="w-full bg-purple-600 hover:bg-purple-500 rounded-xl font-bold">
                      Post Message
                    </Button>
                  </div>
                )}

                {/* Dummy/Actual Comments List */}
                <div className={`space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar ${!isSignedIn ? 'pointer-events-none select-none' : ''}`}>
                  {/* Map through comments here */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px]">JD</div>
                      <span className="text-xs font-bold">Jane Doe</span>
                      <span className="text-[10px] opacity-40">2h ago</span>
                    </div>
                    <p className="text-sm opacity-80">Can't wait for this! The location looks amazing. 🥂</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}