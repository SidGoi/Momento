"use client";
import React from "react";

const GoiButton = ({ label, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center px-8 py-3 
        font-bold text-white bg-black rounded-lg overflow-hidden 
        transition-all duration-300 ease-out
        hover:bg-neutral-800 cursor-pointer active:scale-95 active:shadow-inner
        group ${className}
      `}
    >
      {/* Subtle hover glow effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      
      <span className="relative">{label}</span>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
};

export default GoiButton;