"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ShareButton from "./ShareButton";
import { Calendar, MapPin } from "lucide-react";

const PublicEventCard = ({ data }) => {
  const { title, coverImage, host, date, location } = data;

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col w-full md:max-w-80 gap-0 cursor-pointer overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 shadow-2xl">
      
      {/* Share Button Overlay */}
      <div className="absolute top-4 left-4 z-30 scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ShareButton href={`/event/${data.slug}`} />
      
      </div>

      <Link href={`/event/${data.slug}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square md:aspect-square">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Date Badge - Glassmorphism style */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            {formattedDate}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white tracking-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
              {title}
            </h2>
            
            {/* Location if available */}
            {location && (
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs truncate">{location}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-white/10" />

          {/* Host Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={host.avatar}
                  alt={host.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Hosted by</span>
                <span className="text-sm font-semibold text-gray-200">{host.name}</span>
              </div>
            </div>
            
            {/* Arrow Indicator */}
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" className="text-white">
                    <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PublicEventCard;