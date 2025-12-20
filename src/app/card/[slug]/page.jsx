import Image from "next/image";
import React from "react";

export default async function CardPage({ params }) {
  const { slug } = await params;

  // It's better to use an absolute URL or a helper for the API base
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cards/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return <div className="flex items-center justify-center min-h-screen">❌ Card Not Found</div>;
      throw new Error("Failed to fetch");
    }

    const data = await res.json();
    const isVideo = data.background?.url?.endsWith(".mp4");

    return (
      <main
        className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center ${
          data.background?.theme === "dark" ? "text-black" : "text-white"
        }`}
      >
        {/* Background Layer */}
        {isVideo ? (
          <video
            src={data.background.url}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10"
          />
        ) : (
          <Image
            src={data.background?.url || "/default-bg.jpg"}
            alt="background"
            fill
            className="absolute inset-0 object-cover -z-10"
          />
        )}

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 p-6 text-center">
          
          {/* Sender Info */}
          <div className="flex items-center gap-3 bg-black/10 backdrop-blur-md px-8 cursor-pointer py-2 rounded-full border border-white/10">
            <span className="text-sm opacity-80">From</span>
            <Image
              src={data.host.avatar}
              height={40}
              width={40}
              className="h-8 w-8 rounded-full object-cover border border-white/20"
              alt="host"
            />
            <b className="text-lg">{data.host.name}</b>
          </div>

          {/* Main Card Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Image
              src={data.image}
              alt={data.title}
              height={400}
              width={400}
              priority
              className="relative w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl border border-white/20"
            />
          </div>

          {/* Text Content */}
          <div className="max-w-md space-y-2">
            <h1
              style={{ fontFamily: data.font }}
              className="text-5xl md:text-6xl font-bold drop-shadow-lg"
            >
              {data.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error(error);
    return <div className="flex items-center justify-center min-h-screen">Something went wrong</div>;
  }
}