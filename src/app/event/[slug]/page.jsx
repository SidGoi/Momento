"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { format, formatDistanceToNow } from "date-fns";
import { CalendarDays, MapPin, MessageSquare, Lock } from "lucide-react";
import CreateButton from "@/Components/CreateButton";
import ShareButton from "@/Components/ShareButton";
import Link from "next/link";
import EventAnimations from "@/Components/EventAnimations";
import { toast } from "sonner";

export default function EventViewPage() {
  const { slug } = useParams();
  const { user, isLoaded, isSignedIn } = useUser();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [posting, setPosting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Fetch Event & Comments in parallel */
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch event details and comments
        const [eventRes, commentsRes] = await Promise.all([
          fetch(`/api/events/${slug}`),
          fetch(`/api/events/${slug}/comments`, { cache: "no-store" }) // Prevent caching
        ]);

        const eventData = await eventRes.json();
        const commentsData = await commentsRes.json();

        setEvent(eventData);
        // Ensure we are setting the comments from the DB
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handlePostComment = async () => {
    if (!commentText.trim() || !user) return;

    setPosting(true);
    try {
      const res = await fetch(`/api/events/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: commentText,
          username: user.fullName || user.username,
          userIcon: user.imageUrl,
        }),
      });

      const newComment = await res.json();

      if (res.ok) {
        setComments((prev) => [newComment, ...prev]);
        toast.success('Comment Added Successfully!')
        setCommentText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPosting(false);
    }
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "/link.svg"; // fallback icon
    }
  };


  if (!mounted || loading || !isLoaded) return <MomentoLoader />;
  if (!event) return <div className="text-white text-center mt-20">Event not found</div>;

  // Safe Date Formatting
  const eventDate = event.date ? new Date(event.date) : new Date();

  return (
    <EventAnimations>
      <main className={`relative min-h-screen w-full flex flex-col gap-6 items-center justify-center p-4 md:p-8 lg:p-12 overflow-x-hidden ${event.background?.theme === "dark" ? "text-black" : "text-white"}`}>

        {/* Background Layer */}
        <div className="fixed inset-0 -z-10">
          {event.background?.url?.endsWith(".mp4") ? (
            <video src={event.background.url} autoPlay loop muted playsInline className="w-screen h-screen object-cover" />
          ) : (
            <Image
              src={event.background?.url || "/default-bg.jpg"}
              fill
              className="object-cover"
              alt="Background"
              priority
              unoptimized={event.background?.url?.endsWith('.gif')}
            />
          )}
        </div>

        {/* Header */}
        <header className="w-full md:px-20 animate-ui flex items-center justify-between z-10">
          <Link href="/">
            <Image
              src={event.background?.theme === "dark" ? "/momento-dark.svg" : "/momento.svg"}
              alt="logo"
              height={40}
              width={150}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex gap-2">
            <CreateButton url="/create/event" />
            <ShareButton title={event.title} />
          </div>
        </header>

        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-start z-10">

          {/* LEFT COLUMN */}
          <div className="flex flex-col items-center gap-6 lg:sticky lg:top-10 w-full lg:w-1/2">
            <div className="animate-ui flex items-center gap-3 bg-black/10 backdrop-blur-md px-8 py-2 rounded-full border border-white/10">
              <span className="text-sm opacity-80">From</span>
              <Image src={event.host?.avatar || "/default-avatar.png"} height={40} width={40} className="h-8 w-8 rounded-full" alt="host" />
              <b className="text-lg">{event.host?.name || "Host"}</b>
            </div>

            <Image
              src={event.coverImage || "/placeholder.jpg"}
              width={500}
              height={500}
              alt="event cover"
              className="animate-cover rounded-xl border-2 aspect-square w-80 object-cover shadow-2xl"
            />

            <h1 className="animate-text text-4xl md:text-6xl font-black text-center leading-tight" style={{ fontFamily: event.font?.heading }}>
              {event.title}
            </h1>
            <p className="animate-text opacity-80 text-center max-w-md">
              {event.description}
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[450px] space-y-6">
            <div className="flex gap-4 flex-wrap">
              <div className="animate-ui flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                <CalendarDays className="w-5 h-5 text-purple-400" />
                <span>{format(eventDate, "PPP")} @ {event.time}</span>
              </div>
              <div className="animate-ui flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>{event.location}</span>
              </div>
            </div>
            {/* SOCIAL LINKS */}
            {event.socialLinks && event.socialLinks.length > 0 && (
              <div className="animate-section space-y-3">
                <h3 className="uppercase tracking-widest text-xs opacity-60 ml-1">
                  Links
                </h3>

                <div className="flex flex-col gap-3">
                  {event.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl 
                     bg-white/10 backdrop-blur-md 
                     border border-white/10
                     hover:bg-white/20 hover:scale-[1.02]
                     transition-all"
                    >
                      <img
                        src={getFavicon(link.url)}
                        alt="icon"
                        className="w-6 h-6"
                      />

                      <span className="font-medium text-sm">
                        {link.label}
                      </span>

                      <span className="ml-auto opacity-40 text-xs">
                        Open
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}


            {event.sections && event.sections.length > 0 && (
              <div className="space-y-4">
                {event.sections.map((sec, idx) => (
                  <div key={idx} className="animate-section bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: event.font?.heading }}>
                      {sec.heading}
                    </h3>
                    <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">
                      {sec.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {event.commentsEnabled && (
              <div className="animate-section bg-black/30 text-white backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-xl">
                <h3 className="uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 " /> Guestbook
                </h3>

                {!isSignedIn ? (
                  <div className="text-center py-10">
                    <Lock className="mx-auto mb-3 opacity-50" />
                    <SignInButton mode="modal">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200">Sign In to Comment</Button>
                    </SignInButton>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    <Textarea
                      placeholder="Write a sweet note..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="bg-white/5 text-white placeholder:text-white border-white/10 focus:border-purple-500 transition-colors"
                    />
                    <Button
                      onClick={handlePostComment}
                      disabled={posting || !commentText.trim()}
                      className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {posting ? "Posting..." : "Post Message"}
                    </Button>
                  </div>
                )}

                <div className="space-y-4 max-h-[350px] overflow-y-scroll pr-2 custom-scrollbar">
                  {comments.length === 0 && <p className="text-center py-4 text-sm">No messages yet...</p>}
                  {comments.map((c, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Image src={c.userIcon || "/default-avatar.png"} width={24} height={24} className="rounded-full" alt="user" />
                        <b className="text-sm">{c.username}</b>
                        <span className="text-[10px] opacity-40 ml-auto">
                          {c.timestamp ? formatDistanceToNow(new Date(c.timestamp)) + " ago" : "just now"}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 leading-relaxed">{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


        </div>
      </main>
    </EventAnimations>
  );
}
