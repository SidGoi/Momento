import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavLink from './NavLink'

const Navbar = () => {
    return (
        <header>
            <nav className='flex bg-white px-10 py-8 rounded-b-xl mx-10 items-center justify-between'>
                <Link href={'/'}>
                    <Image src={'/momento-dark.svg'} alt="Momento Logo" width={500} height={500} className='h-8 w-auto cursor-pointer' />
                </Link>
                <div className='flex items-center justify-center gap-5'>
                    <NavLink
                        label="Event"
                        href="/"
                        emoji="🎉"
                        color="#FA6868" // Green holiday vibe
                    />
                    <NavLink
                        label="Cards"
                        href="/"
                        emoji="🗃️"
                        color="#060771" // Green holiday vibe
                    />
                </div>
                <SignedOut>
                    <div className="flex items-center gap-6 font-semibold">
                        <Link href="/auth/signup" className='font-semibold hover:underline transition duration-300'>SignUp</Link>
                        <Link href="/auth/signin" className='bg-black-1 flex items-center justify-center gap-1 text-white px-6 py-2 rounded-full hover:bg-black-2 transition duration-300'>SignIn <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z" /></svg></Link>

                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="flex items-center gap-5">
                        <Link href="/dashboard" className='bg-black-1 flex items-center justify-center gap-1 text-white px-6 py-2 rounded-full hover:bg-black-2 transition duration-300'>Dashboard</Link>
                        <div className="w-fit flex justify-center items-center scale-125">
                            <UserButton />
                        </div>
                    </div>
                </SignedIn>
            </nav>
        </header>
    )
}

export default Navbar
