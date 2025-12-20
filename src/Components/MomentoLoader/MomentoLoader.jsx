"use client";

import "./MomentoLoader.css";

export default function MomentoLoader() {
  const text = "Momento";

  return (
    <div className="loader-wrapper">
      <div className="loader">
        {text.split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
