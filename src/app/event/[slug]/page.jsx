"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { format } from "date-fns";
import { CalendarDays, MapPin, MessageSquare, Lock } from "lucide-react";
import CreateButton from "@/Components/CreateButton";
import ShareButton from "@/Components/ShareButton";
import Link from "next/link";
import EventAnimations from "@/Components/EventAnimations";

export default function EventViewPage() {
  const { slug } = useParams();
  const { user, isLoaded, isSignedIn } = useUser();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
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
    <EventAnimations>
      <main
        className={`relative min-h-screen w-full flex flex-col gap-6 items-center justify-center p-4 md:p-8 lg:p-12 overflow-x-hidden ${
          event.background?.theme === "dark" ? "text-black" : "text-white"
        }`}
      >
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          {event.background?.url?.endsWith(".mp4") ? (
            <video
              src={event.background.url}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={event.background?.url || "/default-bg.jpg"}
              fill
              className="object-cover"
              alt="bg"
              priority
            />
          )}
        </div>

        {/* Header */}
        <header className="w-full md:px-20 animate-ui flex items-center justify-between">
          <Link href="/">
            <Image
              src={
                event.background?.theme === "dark"
                  ? "/momento-dark.svg"
                  : "/momento.svg"
              }
              alt="logo"
              priority
              height={400}
              width={300}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex gap-2">
            <CreateButton url="/create/event" />
            <ShareButton title={event.title} />
          </div>
        </header>

        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* LEFT */}
          <div className="flex flex-col items-center gap-6 lg:sticky lg:top-10 w-full lg:w-1/2">
            {/* Host */}
            <div className="animate-ui flex items-center gap-3 bg-black/10 backdrop-blur-md px-8 py-2 rounded-full border border-white/10">
              <span className="text-sm opacity-80">From</span>
              <Image
                src={event.host.avatar}
                height={40}
                width={40}
                className="h-8 w-8 rounded-full object-cover border border-white/20"
                alt="host"
              />
              <b className="text-lg">{event.host.name}</b>
            </div>

            {/* Cover Image */}
            <div className="relative w-full flex items-center justify-center">
              <Image
                src={event.coverImage}
                width={500}
                height={500}
                alt="event cover"
                className="animate-cover rounded-xl border-2 object-cover aspect-square w-80"
              />
            </div>

            {/* Title & Description */}
            <div className="w-full space-y-4 flex flex-col items-center text-center">
              <h1
                className="animate-text text-4xl md:text-6xl font-black tracking-tight"
                style={{ fontFamily: event.font?.heading }}
              >
                {event.title}
              </h1>
              <p className="animate-text text-lg md:text-xl opacity-80 leading-relaxed font-light">
                {event.description}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[450px] space-y-6">
            {/* Date & Location */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
              <div className="animate-ui flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <CalendarDays className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">
                  {format(new Date(event.date), "PPP")} @ {event.time}
                </span>
              </div>
              <div className="animate-ui flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">{event.location}</span>
              </div>
            </div>

            {/* Sections */}
            {event.sections?.map((sec, i) => (
              <div
                key={i}
                className="animate-section bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
              >
                <h4 className="font-bold text-purple-400 uppercase tracking-widest text-xs mb-2">
                  {sec.heading}
                </h4>
                <p className="opacity-80 text-sm leading-relaxed">
                  {sec.description}
                </p>
              </div>
            ))}

            {/* Guestbook */}
            {event.commentsEnabled && (
              <div className="animate-section bg-black/30 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 opacity-60" />
                  <h3 className="font-bold uppercase tracking-widest text-xs opacity-60">
                    Guestbook
                  </h3>
                </div>

                <div className="relative">
                  {!isSignedIn && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-center p-4">
                      <Lock className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm font-bold mb-3">
                        Sign in to leave a message
                      </p>
                      <SignInButton mode="modal">
                        <Button size="sm" className="bg-white text-black rounded-full font-bold">
                          Sign In
                        </Button>
                      </SignInButton>
                    </div>
                  )}

                  {isSignedIn && (
                    <div className="space-y-3 mb-6">
                      <Textarea
                        placeholder="Write a sweet note..."
                        className="bg-white/5 border-white/10 rounded-2xl resize-none min-h-[100px]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button className="w-full bg-purple-600 hover:bg-purple-500 rounded-xl font-bold">
                        Post Message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </EventAnimations>
  );
}
