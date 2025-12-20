"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Card from "@/Components/Card";
import EventCard from "@/Components/EventCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import Button from "@/Components/Button";
import Image from "next/image";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { Carousel, CarouselContent, CarouselItem } from "@/Components/ui/carousel";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [myCards, setMyCards] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [eventsRes, cardsRes] = await Promise.all([
          fetch(`/api/events?userId=${user.id}`),
          fetch(`/api/cards?userId=${user.id}`)
        ]);

        if (!eventsRes.ok || !cardsRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const eventsData = await eventsRes.json();
        const cardsData = await cardsRes.json();

        setEvents(eventsData);
        setMyCards(cardsData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false); // ✅ ONLY here
      }
    };

    fetchDashboardData();
  }, [isLoaded, user]);


  if (!isLoaded || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <MomentoLoader />
      </div>
    );
  }
  // Inside Dashboard.js
  // Function for events
  const handleRemoveEvent = (slug) => {
    setEvents((prev) => prev.filter((event) => event.slug !== slug));
  };

  // NEW: Function for cards
  const handleRemoveCard = (slug) => {
    setMyCards((prev) => prev.filter((card) => card.slug !== slug));
  };
  return (
    <div className="bg-black-1">
      <video
        className="fixed top-0 left-0 w-full h-full object-top object-cover -z-1"
        src="/web.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <header className="flex flex-row items-center justify-between px-4 md:px-14 py-6 md:py-10 gap-4">
        <Link href={"/"}>
          <Image
            src={"/momento.svg"}
            alt="Momento Logo"
            height={500}
            width={500}
            className="h-9 w-auto cursor-pointer"
          />
        </Link>



        <div className="flex gap-2 md:gap-5">
          <Dialog className="">
            <DialogTrigger asChild>
              <Button label="Create" variant="light" />
            </DialogTrigger>
            <DialogContent className="text-white bg-black cursor-pointer">
              <DialogHeader>
                <DialogTitle>Create New</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <Link href="/create/event">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10 mb-3 cursor-pointer">
                    {/* Left Side */}
                    <div className="flex items-center gap-4">
                      <Image
                        src="/event.png"
                        alt="Event Thumbnail"
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />

                      <div>
                        <h3 className="text-lg font-medium text-white">
                          Event
                        </h3>
                        <p className="text-sm text-gray-400">Collect RSVPs</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M579-480 285-774q-15-15-14.5-35.5T286-845q15-15 35.5-15t35.5 15l307 308q12 12 18 27t6 30q0 15-6 30t-18 27L356-115q-15 15-35 14.5T286-116q-15-15-15-35.5t15-35.5l293-293Z" />
                    </svg>
                  </div>
                </Link>

                {/* Option 2 - Card */}
                <Link href="/create/card">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10 cursor-pointer">
                    {/* Left Side */}
                    <div className="flex items-center gap-4">
                      <Image
                        src="/card.png"
                        alt="Card Thumbnail"
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-white">
                            Card
                          </h3>

                          {/* NEW Badge */}
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            New!
                          </span>
                        </div>

                        <p className="text-sm text-gray-400">
                          Send digital cards
                        </p>
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M579-480 285-774q-15-15-14.5-35.5T286-845q15-15 35.5-15t35.5 15l307 308q12 12 18 27t6 30q0 15-6 30t-18 27L356-115q-15 15-35 14.5T286-116q-15-15-15-35.5t15-35.5l293-293Z" />
                    </svg>
                  </div>
                </Link>
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Link href={"/"} className="flex mr-1  items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#fff"><path d="M160-200v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H600q-17 0-28.5-11.5T560-160v-200q0-17-11.5-28.5T520-400h-80q-17 0-28.5 11.5T400-360v200q0 17-11.5 28.5T360-120H240q-33 0-56.5-23.5T160-200Z" /></svg>
          </Link>
          <div className="scale-135  flex items-center justify-center">
            <UserButton />
          </div>
        </div>
      </header>



      <div className="flex flex-col mt-8 md:mt-0 font-bold text-2xl md:text-3xl px-4 md:px-14 gap-2 text-white">
        <h1>Welcome back {user.fullName}!</h1>
        <p className="text-xl">You have {events.length} upcoming events.</p>
      </div>

      <div className="px-4 md:px-14 py-5">
        {events.length === 0 ? (
          <div className="flex text-white font-semibold gap-2 items-center justify-center flex-col p-5">
            <span className="text-7xl">
              😐
            </span>
            <span className="text-2xl">
              No Event yet
            </span>
            <Link href="/create/event" className="flex items-center justify-center">
              <button className="inline-flex items-center p-3 cursor-pointer gap-2 md:px-6 md:py-2.5 bg-[#121212] border border-gray-600 text-white rounded-full font-semibold hover:bg-[#1f1f1f] transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" /></svg>
                <span>Craete</span>
              </button>

            </Link>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="relative"
          >
            {events.length > 3
              &&
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/40 to-transparent z-10" />

            }
            <div className="md:hidden pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/40 to-transparent z-10" />
            <CarouselContent className="">
              {events.map((event) => (
                <CarouselItem
                  key={event._id}
                  className="basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[25%]"
                >
                  <EventCard data={event} onDelete={handleRemoveEvent} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>


      <div className="px-4 md:px-14 flex flex-col justify-center gap-3 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-2xl md:text-3xl text-white">
            <h1 className=" font-bold text-2xl">Your Cards</h1>
            <p className="text-lg md:text-md">All the cards you've created</p>
          </div>
          <Link href="/create/card" className="flex items-center justify-center">
            <button className="inline-flex items-center p-3 cursor-pointer gap-2 md:px-6 md:py-2.5 bg-[#121212] border border-gray-600 text-white rounded-full font-semibold hover:bg-[#1f1f1f] transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" /></svg>

              <span className="hidden md:flex">New card</span>
            </button>

          </Link>
        </div>


        {myCards.length === 0 ? (
          <div className="flex text-white font-semibold gap-2 items-center justify-center flex-col p-5">
            <span className="text-7xl">
              😐
            </span>
            <span className="text-2xl">
              No Card yet
            </span>
            <Link href="/create/card" className="flex items-center justify-center">
              <button className="inline-flex items-center p-3 cursor-pointer gap-2 md:px-6 md:py-2.5 bg-[#121212] border border-gray-600 text-white rounded-full font-semibold hover:bg-[#1f1f1f] transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" /></svg>
                <span>Craete</span>
              </button>

            </Link>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="relative"
          >

            {myCards.length > 3
              &&
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/40 to-transparent z-10" />
            }

            <div className="md:hidden pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/40 to-transparent z-10" />

            <CarouselContent className="">

              {myCards.map((card) => (
                <CarouselItem
                  key={event._id}
                  className="basis-[62%] sm:basis-[22%] md:basis-[22%] lg:basis-[22%]"
                >
                  <Card key={card._id} onDelete={handleRemoveCard} data={card} />
                </CarouselItem>
              ))}
            </CarouselContent>

          </Carousel>
        )}
      </div>

      <footer className="border-t-1 mt-10 p-10 border-gray-600 flex flex-col md:flex-row gap-3 items-center justify-between">
        <Link href={"/"} className="flex gap-3 items-center justify-center">
          <Image
            src={"/momento.svg"}
          alt="Momento Logo"
            height={500}
            width={500}
            className="h-6 w-auto cursor-pointer"
          />
          <h1 className="text-white text-sm md:text-lg font-semibold">
            Create an event for free 🎉
          </h1>
        </Link>
        <Link href={"/"} className="flex gap-3 items-center justify-center">
          <h1 className="text-white font-semibold text-sm md:text-lg">Developed by</h1>
          <h1 className="text-2xl text-white font-primary">Siddharaj Gohil</h1>
        </Link>
      </footer>
    </div>
  );
};

export default Dashboard;
