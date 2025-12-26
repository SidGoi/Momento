
import Image from "next/image";
import React from "react";
import CardAnimations from "@/Components/CardAnimations"; // Path to your wrapper
import Link from "next/link";
import ShareButton from "@/Components/ShareButton";
import CreateButton from "@/Components/CreateButton";
import { optimizeCloudinaryUrl } from "@/lib/optimizeCloudinaryUrl";

export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/cards/${params.slug}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${baseUrl}/card/${params.slug}`,
      images: [
        {
          url: data.image,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [data.image],
    },
  };
}


export default async function CardPage({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cards/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return <div className="flex items-center justify-center min-h-screen">Card Not Found</div>;
      throw new Error("Failed to fetch");
    }
    const data = await res.json();
    const isVideo = data.background?.url?.endsWith(".mp4");
    data.background.url = optimizeCloudinaryUrl(data.background.url, { width: 1200 })

    return (
      <main className={`relative min-h-screen w-full pt-10 overflow-hidden flex items-center justify-center ${data.background?.theme === "dark" ? "text-black" : "text-white"}`}>


        {/* Background Layer (Unchanged) */}
        {isVideo ? (
          <video src={data.background.url} autoPlay muted loop playsInline className="fixed inset-0 w-screen h-screen object-cover -z-10" />
        ) : (
          <Image priority src={data.background?.url || "/default-bg.jpg"} alt="background" fill className="absolute inset-0 object-cover -z-10" />
        )}

        {/* Wrap content in Animation Component */}
        <CardAnimations>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 p-6 text-center perspective-1000">

            <header className="w-full fixed top-6 px-6 animate-sender flex items-center justify-between ">
              <Link href={'/'}>
                <Image src={data.background?.theme === "dark" ? '/momento-dark.svg' : '/momento.svg'}
                  alt="logo"
                  priority
                  height={400}
                  width={300}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="flex gap-2 items-center justify-center">
                <CreateButton url={'/create/card'} />
                <ShareButton title={data.title} host={data.host.name} />
              </div>
            </header>

            <div className="flex items-center justify-center flex-col gap-6">



              {/* Sender Info */}
              <div className="animate-sender flex items-center gap-3 bg-black/10 backdrop-blur-md px-6 py-1 md:px-8 md:py-2 rounded-full border border-white/10">
                <span className="text-xs sm:text-sm opacity-80">From</span>
                <Image src={optimizeCloudinaryUrl(data.host.avatar)} height={40} width={40} className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-white/20" alt="host" />
                <b className="text-sm sm:text-lg line-clamp-1">{data.host.name}</b>
              </div>

              {/* Main Card Image with 3D Class */}
              <div className="animate-card relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <Image
                  src={optimizeCloudinaryUrl(data.image)}
                  alt={data.title}
                  height={400}
                  width={400}
                  priority
                  className="relative w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl border border-white/20"
                />
              </div>

            </div>

            {/* Text Content */}
            <div className="max-w-md space-y-2">
              <h1
                style={{ fontFamily: data.font }}
                className="animate-text text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg"
              >
                {data.title}
              </h1>
              <p className="animate-text text-lg sm:text-xl md:text-2xl font-medium opacity-90 leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </CardAnimations>
      </main>
    );
  } catch (error) {
    console.error(error);
    return <div className="flex items-center justify-center min-h-screen">Something went wrong</div>;
  }
}