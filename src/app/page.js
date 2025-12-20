import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <nav className="flex items-center justify-between px-10 py-5">
        <div className="text-2xl font-semibold">Momento</div>
        <SignedOut>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">SignIn</Link>
            <Link href="/auth/signup">SignUp</Link>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-5">
            <Link href="/dashboard">Dashboard</Link>
            <div className="w-fit flex justify-center items-center scale-125">
              <UserButton />
            </div>
          </div>
        </SignedIn>
      </nav>
    </div>
  );
};

export default HomePage;
