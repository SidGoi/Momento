"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function EventAnimations({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Event Cover Image Animation
      tl.from(".animate-cover", {
        scale: 0.8,
        opacity: 0,
        rotateX: 40,
        duration: 1.4,
      })

      // Floating Effect
      .to(".animate-cover", {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: "sine.inOut",
      });

      // Title & Description
      gsap.from(".animate-text", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.4,
      });

      // Header / Sender / Badges
      gsap.from(".animate-ui", {
        y: -30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        delay: 0.2,
      });

      // Right side cards
      gsap.from(".animate-section", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        delay: 0.6,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
