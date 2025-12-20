"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function EventPage() {
  const params = useParams();
  const { slug } = params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch event");

        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!event) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Cover Image */}
      <div className="relative h-64 w-full rounded-lg overflow-hidden">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Event Info */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold" style={{ fontFamily: event.font?.heading || "Playfair_Display" }}>
          {event.title}
        </h1>
        <p className="text-gray-700" style={{ fontFamily: event.font?.body || "Inter" }}>
          {event.description}
        </p>

        <div className="flex gap-4 text-gray-600">
          <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Image src={event.host.avatar} width={40} height={40} alt={event.host.name} className="rounded-full" />
          <p className="font-medium">{event.host.name}</p>
        </div>
      </div>

      {/* Dynamic Sections */}
      <div className="space-y-4 mt-6">
        {event.sections?.map((section, idx) => (
          <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: event.background?.secondary || "#f2f2f2" }}>
            <h2 className="text-xl font-semibold" style={{ fontFamily: event.font?.heading || "Playfair_Display" }}>
              {section.heading}
            </h2>
            <p className="text-gray-700" style={{ fontFamily: event.font?.body || "Inter" }}>
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
