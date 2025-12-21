"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CreateButton({ url }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(url)}
      className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-xl backdrop-blur-lg transition-all duration-300 hover:bg-white/20 cursor-pointer hover:border-white/50 hover:shadow-2xl active:scale-90"
    >
      {/* Gloss */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-50" />

      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e3e3e3"
        className="z-10 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110"
      >
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
      </svg>
    </button>
  );
}
