"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CreateButton({ url }) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Create new card"
      onClick={() => router.push(url)}
      className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-xl backdrop-blur-lg transition-all duration-300 hover:bg-white/10 cursor-pointer hover:border-white/20 hover:shadow-2xl active:scale-90"
    >
      {/* Gloss Layer */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-50" />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="24"
        height="24"
        fill="#FFFFFF"
        className="z-10 transition-transform duration-300 group-hover:rotate-90"
      >
        <path d="M480-120q-17 0-28.5-11.5T440-160v-280H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h280v-280q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800v280h280q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H520v280q0 17-11.5 28.5T480-120Z" />
      </svg>
    </button>
  );
}
