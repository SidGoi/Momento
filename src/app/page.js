import CircularImageCarousel from "@/Components/CircularImageCarousel";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen  text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Capture the <span className="text-gray-400">Momento</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          The all-in-one platform to create digital cards, collect RSVPs, and
          share unforgettable event experiences with your favorite people.
        </p>

        <div className="flex gap-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
                Get Started for Free
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default HomePage;
