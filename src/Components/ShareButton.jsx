"use client";

import React from "react";

export default function ShareButton({ title, href }) {
  const handleShare = async () => {
    const url = href || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this card: ${title}`,
          url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard 📋");
      } catch (err) {
        alert("Failed to copy link");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-black/30 bg-black/10 shadow-xl backdrop-blur-lg transition-all duration-300 hover:bg-black/20 cursor-pointer hover:border-black/50 hover:shadow-2xl active:scale-90"
    >
      {/* Gloss */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/10 to-transparent opacity-50" />

      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="white"
        className="z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
      >
        <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
      </svg>
    </button>
  );
}
