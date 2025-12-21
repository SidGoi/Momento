"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CardAnimations({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Initial Scale & Rotate for the Main Image
      tl.from(".animate-card", {
        scale: 0,
        rotateY: 180,
        rotateX: 45,
        duration: 1.5,
        opacity: 0,
      })
      // 2. 3D Float Hover Effect (Ongoing)
      .to(".animate-card", {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut"
      }, "-=0.5");

      // 3. Staggered Text Reveal
      gsap.from(".animate-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.5,
        ease: "power3.out"
      });

      // 4. Sender Info Slide Down
      gsap.from(".animate-sender", {
        y: -30,
        opacity: 0,
        duration: 1,
        delay: 1,
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return <div ref={containerRef} className="w-full">{children}</div>;
}