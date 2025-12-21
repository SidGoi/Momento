"use client";

import CircularImageCarousel from "@/Components/CircularImageCarousel";
import CTAComponent from "@/Components/CTAComponent";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import PartfulHero from "@/Components/PartfulHero";
import ScrollingCards from "@/Components/ScrollingCards";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/Components/ui/scroll-based-velocity";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard"); // 👈 redirect here
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null; // prevent flicker

  const eventData = [
    { title: "Clothing Swap", image: "/card1.jpg" },
    { title: "Disco Night", image: "/card2.png" },
    { title: "PLG Runners Meet", image: "/card3.jpg" },
    { title: "Alumni BBQ", image: "/card4.jpg" },
    { title: "Girls Who Pilates", image: "/card5.jpg" },
    { title: "Beach Clean Up", image: "/card6.jpg" },
    { title: "Sunset Yoga", image: "/card7.jpg" },
    { title: "Tech Mixer", image: "/card8.jpg" },
    { title: "Art Gallery Opening", image: "/card9.jpg" },
    { title: "Coffee & Coding", image: "/card10.jpg" },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <Navbar />
      <PartfulHero />
      <ScrollingCards cards={eventData} />

      <ScrollVelocityContainer baseVelocity={5}>
        <ScrollVelocityRow className="mb-3 text-2xl md:text-5xl font-bold text-black-1">
          Remember your mortality to unlock your vitality — The clock is
          ticking, make every second a masterpiece.
        </ScrollVelocityRow>

        <ScrollVelocityRow
          className="text-2xl md:text-5xl font-bold text-black-1"
          baseVelocity={5}
          direction={-1}
        >
          Not to fear death, but to never begin to live — Waste no more time
          arguing what a good man should be. Be one.
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      <CTAComponent
        imageSrc={"/CTA1.jpg"}
        href={"/create/card"}
        title="Invite your past guests back by using Momento"
        description="Easily reach out to everyone who attended your previous events with just one click."
      />

      <CTAComponent
        imageSrc={"/CTA2.jpg"}
        href={"/create/event"}
        reverse
        btn="Try it for free"
        title="Event pages that match your aesthetic"
        description="Make your invites unmistakably yours with easy-to-use designs, custom animations, and a vibe that’s all about you."
      />

      <Footer />
    </div>
  );
};

export default HomePage;
