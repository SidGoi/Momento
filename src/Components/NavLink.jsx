import React from "react";

const NavLink = ({ label, href = "#", emoji = "🔥", color = "#000" }) => {
  return (
    <a
      href={href}
      className="relative flex items-center gap-2 font-semibold transition-all duration-300 group text-lg"
      style={{ color: "#444" }}
    >
      {/* Emoji Animation */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
        scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 
        transition-all duration-300 text-3xl"
      >
        {emoji}
      </span>

      {/* Label Animation */}
      <span
        className="transition-all duration-300 group-hover:translate-y-3 group-hover:opacity-0"
      >
        {label}
      </span>

      {/* Label After Hover */}
      <span
        className="absolute opacity-0 group-hover:opacity-100 group-hover:translate-y-0 
        -translate-y-3 transition-all duration-300"
        style={{ color }}
      >
        {label}
      </span>
    </a>
  );
};

export default NavLink;
