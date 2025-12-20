"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full z-50">
            <nav className="flex bg-white px-4 md:px-10 py-6 md:py-8 rounded-b-xl mx-3 md:mx-10 items-center justify-between relative z-50">
                {/* Logo */}
                <Link className="" href="/">
                    <Image
                        src="/momento-dark.svg"
                        alt="Momento Logo"
                        width={500}
                        height={500}
                        className="h-7 md:h-8 w-auto cursor-pointer"
                    />
                </Link>

                <div className="hidden md:flex items-end justify-end  gap-6 font-semibold">
                    <SignedOut>
                        <Link href="/auth/signup" className="hover:underline transition duration-300">
                            SignUp
                        </Link>
                        <Link href="/auth/signin" className="bg-black text-white px-6 py-2 rounded-full hover:opacity-80 transition duration-300 flex items-center gap-2">
                            SignIn
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z" /></svg>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center justify-center gap-3">
                            <Link href="/dashboard" className="bg-black text-white px-6 py-2 rounded-full hover:opacity-80 transition duration-300">
                                Dashboard
                            </Link>
                            <div className="scale-125 flex items-center justify-center">
                                <UserButton />
                            </div>
                        </div>
                    </SignedIn>
                </div>

                {/* Right Side (User + Toggle) */}
                <div className="flex flex md:hidden items-center gap-4">
                    <div className="scale-110 flex md:hidden items-center justify-center">
                        <UserButton />
                    </div>

                    {/* Animated Hamburger/Cross Button */}
                    <button
                        className="md:hidden cursor-pointer relative z-[60] w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
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
                    className={`fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    onClick={() => setOpen(false)}
                />

                {/* Mobile Sidebar */}
                <div className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[55] md:hidden transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'} p-8 flex flex-col gap-4 text-xl pt-24`}>
                    <SignedOut>
                        <Link
                            href="/auth/signup"
                            className="text-2xl font-bold border-b border-gray-100 pb-2"
                            onClick={() => setOpen(false)}
                        >
                            SignUp
                        </Link>
                        <Link
                            href="/auth/signin"
                            className="bg-black text-white px-6 py-4 rounded-xl text-center font-bold text-lg"
                            onClick={() => setOpen(false)}
                        >
                            SignIn
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link
                            href="/dashboard"
                            className="text-black-1 font-semibold"
                            onClick={() => setOpen(false)}
                        >
                            Explore
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-black-1 font-semibold"
                            onClick={() => setOpen(false)}
                        >
                            Create Event
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-black-1 font-semibold"
                            onClick={() => setOpen(false)}
                        >
                            Create Card
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-black mt-2 text-white px-6 py-4 rounded-xl text-center font-bold text-lg"
                            onClick={() => setOpen(false)}
                        >
                            Dashboard
                        </Link>
                    </SignedIn>

                    <div className="mt-auto">
                        <Link className="" href="/">
                            <Image
                                src="/momento-dark.svg"
                                alt="Momento Logo"
                                width={500}
                                height={500}
                                className="h-7 mb-3 opacity-55 md:h-8 w-auto cursor-pointer"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm italic font-primary">Create, Connect & Celebrate!.</p>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;