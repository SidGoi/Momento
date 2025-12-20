import CircularImageCarousel from "@/Components/CircularImageCarousel";
import Navbar from "@/Components/Navbar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className=" min-h-screen">
      <Navbar />

      <CircularImageCarousel />
    </div>
  );
};

export default HomePage;
