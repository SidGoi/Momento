"use client";
import React from "react";
import Image from "next/image";
import { Marquee } from "./ui/marquee";

const ScrollingCards = ({ cards }) => {
  // We double the cards to create the seamless infinite loop effect
  const scrollingContent = [...cards, ...cards];

  return (
    <section className="relative z-10 w-full py-12 md:py-20 bg-gray-50/50">
      <h2 className="text-center text-2xl md:text-5xl font-bold mb-8 md:mb-16 text-black px-4">
        A home for your events...
      </h2>

      <div className="w-full">
        {/* Marquee component usually handles its own overflow/flex logic */}
        <Marquee pauseOnHover className="[--duration:40s] flex gap-4 md:gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 sm:w-56 md:w-72 bg-white p-2 md:p-4 shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-lg"
            >
              <p className="text-center font-bold text-gray-400 mb-2 md:mb-4 uppercase tracking-tighter text-[10px] md:text-xs">
                {card.title}
              </p>
              <div className="relative aspect-[4/5] overflow-hidden rounded-md">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 160px, 280px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default ScrollingCards;