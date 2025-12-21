import React from 'react'
import { WordRotate } from './ui/word-rotate'
import { RainbowButton } from './ui/rainbow-button'
import { LightRays } from './ui/light-rays'
import Link from 'next/link'

const PartfulHero = () => {
    return (
        <main className="relative w-full overflow-hidden bg-white">

            {/* Background Effect */}
            <div className="absolute inset-0 z-0">
                <LightRays />
            </div>

            {/* 1. Hero Content Section */}
            <section className="relative z-10 h-[70vh]  md:h-screen flex flex-col items-center justify-center px-6 text-center pt-20 pb-10">
                <b className="font-primary text-sm md:text-xl text-gray-500 mb-4">
                    Create, Connect & Celebrate with Momento!
                </b>

                <h1 className="flex flex-col items-center justify-center font-semibold text-black leading-tight">
                    <span className="text-2xl md:text-2xl">The best way to organize your</span>
                    <WordRotate
                        className="text-5xl sm:text-7xl md:text-8xl font-bold text-pink-700 uppercase poppins mt-2"
                        duration={1500}
                        words={["Birthdays", "Parties", "Meetings", "Special", "Moments"]}
                    />
                </h1>

                <div className="mt-10">
                    <Link href={'/create/card'}>
                    <RainbowButton>Get Started</RainbowButton>
                    </Link>
                </div>
            </section>
        </main>

    )
}

export default PartfulHero
