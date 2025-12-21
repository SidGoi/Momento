"use client";
import React from "react";
import Image from "next/image";
import Button from "./Button";
import GoiButton from "./GoiButton";
import Link from "next/link";
import { RainbowButton } from "./ui/rainbow-button";

const CTAComponent = ({
    title = "Your events and people, all in one place",
    description = "Send invites, collect RSVPs, and showcase all your events with one shareable link.",
    imageSrc = "/image_cd7c89.jpg", // The image you uploaded
    reverse = false,
    href = '/',
    btn = 'Get started'
}) => {
    return (
        <section className="w-full py-12 md:py-24 px-6 md:px-14 cursor-pointer">
            <div className={`
        max-w-7xl mx-auto flex flex-col items-center gap-12 md:gap-20
        ${reverse ? "md:flex-row-reverse" : "md:flex-row"}
      `}>
                <div className="flex-1 w-full">
                    <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[1.4/1] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                        <Image
                            src={imageSrc}
                            alt="Event Showcase"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 leading-[1.1]">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-500 max-w-lg leading-relaxed">
                        {description}
                    </p>
                    <div className="">
                        <Link href={href}>
                        <RainbowButton>
                            {btn}
                        </RainbowButton>
                        </Link>
                    </div>
                </div>

                {/* Image / Graphic Content */}


            </div>
        </section>
    );
};

export default CTAComponent;