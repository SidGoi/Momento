"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    // Helper to close menu on link click
    const closeMenu = () => setOpen(false);

    return (
        <header className="w-full z-50 fixed  top-5">
            <nav className="flex top-0 bg-white/90 px-4 md:px-10 py-6 md:py-4 rounded-2xl mx-3 md:mx-10 items-center justify-between relative z-50">
                {/* Logo */}
                <Link href="/" onClick={closeMenu}>
                    <Image
                        src="/momento-dark.svg"
                        alt="Momento Logo"
                        width={200} // Fixed: width/height should reflect actual usage ratio
                        height={40}
                        className="h-7 md:h-8 w-auto cursor-pointer"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center justify-end gap-6 font-semibold">
                    <SignedOut>
                        <Link href="/auth/signup" className="hover:underline text-black-1 transition duration-300">
                            SignUp
                        </Link>
                        <Link href="/auth/signin" className="bg-black text-white px-6 py-2 rounded-full hover:opacity-80 transition duration-300 flex items-center gap-2">
                            SignIn
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff">
                                <path d="M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z" />
                            </svg>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="bg-black text-white px-6 py-2 rounded-full hover:opacity-80 transition duration-300">
                                Dashboard
                            </Link>
                            <div className="scale-125 flex items-center">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </div>
                    </SignedIn>
                </div>

                {/* Mobile Icons + Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <SignedIn>
                        <div className="scale-110 flex items-center justify-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>


                    <SignedOut>
                        <Link
                            href="/auth/signup"

                            className="bg-gray-100 border-1 border-gray-400 text-black px-6 py-4 rounded-xl text-center font-bold text-xl"
                            onClick={closeMenu}
                        >
                            SignUp
                        </Link>
                    </SignedOut>
                   

                    <button
                        className="cursor-pointer relative z-[60] w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle Menu"
                    >
                        <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ease-out ${open ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ease-out ${open ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ease-out ${open ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                <div
                    className={`fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 z-[54] ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    onClick={closeMenu}
                />

                {/* Mobile Sidebar */}
                <div className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[55] md:hidden transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'} p-8 flex flex-col gap-6 pt-24`}>
                    <SignedOut>

                        <Link
                            href="/auth/signup"

                            className="bg-gray-100 border-1 border-gray-400 text-black px-6 py-4 rounded-xl text-center font-bold text-xl"
                            onClick={closeMenu}
                        >
                            SignUp
                        </Link>
                        <Link
                            href="/auth/signin"
                            className="bg-black text-white px-6 py-4 rounded-xl text-center font-bold text-xl"
                            onClick={closeMenu}
                        >
                            SignIn
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        {/* Assuming these might be separate routes in the future, otherwise update hrefs */}
                        <Link href="/explore" className="text-black font-semibold text-lg" onClick={closeMenu}>
                            Explore
                        </Link>
                        <Link href="/events/create" className="text-black font-semibold text-lg" onClick={closeMenu}>
                            Create Event
                        </Link>
                        <Link href="/cards/create" className="text-black font-semibold text-lg" onClick={closeMenu}>
                            Create Card
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-black mt-2 text-white px-6 py-4 rounded-xl text-center font-bold text-lg"
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                    </SignedIn>

                    <div className="mt-auto">
                        <Link href="/" onClick={closeMenu}>
                            <Image
                                src="/momento-dark.svg"
                                alt="Momento Logo"
                                width={150}
                                height={30}
                                className="h-7 mb-3 opacity-55 w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm italic">Create, Connect & Celebrate!</p>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;