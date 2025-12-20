import React from "react";

const Button = ({ label, variant = "light" }) => {
  const baseStyles =
    "p-2 md:px-6 md:py-2 rounded-full flex items-center justify-center gap-2 font-bold transition-all duration-300 cursor-pointer";

  const variants = {
    light: "bg-white text-black-1 border border-gray-300 hover:bg-gray-200 cursor-pointer",
    dark: "bg-black text-white hover:bg-gray-900",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" /></svg>
      <span className="hidden md:flex">
      {label}
      </span>
    </button>
  );
};

export default Button;
