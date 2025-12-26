"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Card from "@/Components/Card";
import EventCard from "@/Components/EventCard";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import Button from "@/Components/Button";
import Image from "next/image";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import { Carousel, CarouselContent, CarouselItem } from "@/Components/ui/carousel";
import { optimizeCloudinaryUrl } from "@/lib/optimizeCloudinaryUrl";
import { LightRays } from "@/Components/ui/light-rays";
import { ShimmerButton } from "@/Components/ui/shimmer-button";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [myCards, setMyCards] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardStatus, setCardStatus] = useState(1);
  const [eventFilter, setEventFilter] = useState("all");


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
        setLoading(false);
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventFilter === "upcoming") return eventDate > today;
    if (eventFilter === "ongoing") return eventDate.getTime() === today.getTime();
    if (eventFilter === "past") return eventDate < today;

    return true; // all
  });

  return (
    <div className="px-8 md:px-14 py-8 md:py-10">

      <video
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-50 pointer-events-none"
        src={optimizeCloudinaryUrl("https://res.cloudinary.com/dxoxlurnt/video/upload/v1766266085/web_utfj0o.mp4")}
        autoPlay
        loop
        muted
        playsInline
      />

      <header className="flex flex-row items-center justify-between">
        <Link href={"/"}>
          <Image
            src={"/momento.svg"}
            alt="Momento Logo"
            height={100}
            width={100}
            priority
            className="h-9 w-auto cursor-pointer"
          />
        </Link>

        <div className="flex gap-5 items-center md:gap-5">



          <Dialog className="">
            <DialogTrigger>
              <Button label="Create" variant="light" />
            </DialogTrigger>
            <DialogContent
              className="text-white bg-black cursor-pointer">
              <DialogHeader>
                <DialogTitle>Create New</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <Link href="/create/event">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10 mb-3 cursor-pointer">

                    <div className="flex items-center gap-4">
                      <Image
                        src="/event.png"
                        alt="Event Thumbnail"
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />

                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Event
                        </h3>
                        <p className="text-sm text-gray-400">Collect RSVPs</p>
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

                <Link href="/create/card">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10 cursor-pointer">

                    <div className="flex items-center gap-4">
                      <Image
                        src="/card.jpg"
                        alt="Card Thumbnail"
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
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



          <div className="scale-135  flex items-center justify-center">
            <UserButton />
          </div>
        </div>
      </header>

      <div className="text-white  my-10">
        <h1 className="font-bold text-4xl">Welcome Back, <br /> {user.fullName}!</h1>
      <Link href={'/explore'}>
        <ShimmerButton shimmerSize={'0.05em'} className='mt-4' shimmerColor={'#C47BE4'}>
          Explore Public Events
        </ShimmerButton>
      </Link>
        {/* <p className="text-xl mt-2">You have {events.length} upcoming events.</p> */}
      </div>




      <div className="flex flex-col justify-center gap-3 text-white">
        <div className="flex items-center justify-between">
          <h1 className=" font-bold text-4xl">Cards</h1>
          <Link href="/create/card" className="flex items-center justify-center">
            <button className="inline-flex items-center p-3 cursor-pointer gap-2 md:px-6 md:py-2.5 bg-[#121212] border border-gray-600 text-white rounded-full font-semibold hover:bg-[#1f1f1f] transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" /></svg>

              <span className="hidden md:flex">New card</span>
            </button>

          </Link>
        </div>


        <div className="flex items-center gap-2">
          <p className={` md:text-md font-medium  px-5 py-1 rounded-full border-gray-500 border-1 ${cardStatus == 1 ? 'bg-black-2' : ''}`} onClick={() => setCardStatus(1)}>Your</p>
          <p className={` md:text-md font-medium  px-5 py-1 rounded-full border-gray-500 border-1 ${cardStatus == 1 ? '' : 'bg-black-2'}`} onClick={() => setCardStatus(2)}>Received</p>
        </div>


        {myCards.length === 0 ? (
            <div className="flex text-white font-semibold items-center justify-center flex-col">
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
            <CarouselContent className="">
              {myCards.map((card) => (
                <CarouselItem
                  key={card._id}
                  className="basis-60"
                >
                  <Card key={card._id} onDelete={handleRemoveCard} data={card} />
                </CarouselItem>
              ))}
            </CarouselContent>

          </Carousel>
        )}
      </div>





      <div className="flex flex-col justify-center gap-3 text-white">

        {/* Events */}
        <div className="font-bold text-2xl md:text-3xl mt-5 flex items-center justify-between text-white">
          <div>
            <h1 className=" font-bold text-4xl">Your Events</h1>
          </div>

          <Link href="/create/event" className="flex items-center justify-center">
            <button className="inline-flex items-center p-3 cursor-pointer gap-2 md:px-6 md:py-2.5 bg-[#121212] border border-gray-600 text-white rounded-full font-semibold hover:bg-[#1f1f1f] transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" /></svg>

              <span className="hidden md:flex">New card</span>
            </button>

          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-scroll">
          <p
            className={`px-5 py-1 rounded-full border ${eventFilter === "all" ? "bg-black-2" : ""
              }`}
            onClick={() => setEventFilter("all")}
          >
            All
          </p>

          <p
            className={`px-5 py-1 rounded-full border ${eventFilter === "ongoing" ? "bg-black-2" : ""
              }`}
            onClick={() => setEventFilter("ongoing")}
          >
            Ongoing
          </p>

          <p
            className={`px-5 py-1 rounded-full border ${eventFilter === "upcoming" ? "bg-black-2" : ""
              }`}
            onClick={() => setEventFilter("upcoming")}
          >
            Upcoming
          </p>

          <p
            className={`px-5 py-1 rounded-full border ${eventFilter === "past" ? "bg-black-2" : ""
              }`}
            onClick={() => setEventFilter("past")}
          >
            Past
          </p>
        </div>


        <div className="">
          {filteredEvents.length === 0 ? (
          <div className="flex text-white gap-3 py-10 font-semibold items-center justify-center flex-col">
            <span className="text-7xl">
              🫥
            </span>
            <span className="text-2xl">
              No Event yet
            </span>
            <Link href="/create/card" className="flex items-center justify-center">
              <button className="inline-flex items-center px-5 py-2 cursor-pointer gap-2 md:px-6 md:py-2.5 bg-[#121212] border border-gray-600 text-white rounded-full font-semibold hover:bg-[#1f1f1f] transition-all active:scale-95">
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
              <CarouselContent className="">
                {filteredEvents.map((event) => (
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


      </div>
      <footer className="border-t-1 mt-14 p-10 border-gray-600 flex flex-col md:flex-row items-center justify-between">
        <Link href={"/"} className="flex gap-3 md:flex-row flex-col items-center justify-center">

          <Image
            src={"/momento.svg"}
            alt="Momento Logo"
            height={500}
            width={500}
            className="h-6 w-auto cursor-pointer"
          />
          <h1 className="text-white text-sm md:text-lg font-semibold">
            Create • Connect • Celebrate 🎉
          </h1>

        </Link>
        <p className="text-white mt-3 md:mt-0 -mb-6 flex items-center justify-center gap-3">
          <Link href={'/'} className="hover:underline text-gray-300">Privacy</Link>
          <Link href={'/'} className="hover:underline text-gray-300">Terms</Link>
          <Link href={'/'} className="hover:underline text-gray-300">Support</Link>
          <Link href={'/'} className="hover:underline text-gray-300">Feedback</Link>

        </p>
      </footer>

    </div>
  );
};

export default Dashboard;
