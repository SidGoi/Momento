"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Card from "@/Components/Card";
import EventCard from "@/Components/EventCard";

const Dashboard = () => {
  const { user, isLoaded } = useUser(); // ✅ use isLoaded to check if user is ready
  const [myCards, setMyCards] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/events?userId=${user.id}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Fetch events error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isLoaded, user]);

  useEffect(() => {
    if (!isLoaded || !user) return; // wait until user is loaded

    const fetchCards = async () => {
      try {
        const res = await fetch(`/api/cards?userId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch cards");
        const data = await res.json();
        setMyCards(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCards();
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading...</div>; // show loading until user is ready

  return (
    <div>
      <nav className="flex items-center justify-between px-10 py-5">
        <div className="text-2xl font-semibold">MomentoDashboard</div>
        <div className="flex gap-5">
          <Link href="/create/card">Create Card</Link>
          <Link href="/create/event">Create Event</Link>
          <div className="w-fit flex justify-center items-center scale-125">
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="px-10 py-5 flex flex-col gap-3">
        {events.length === 0 ? (
          "No cards yet"
        ) : (
          <ul className="flex gap-2 flex-wrap">
            {events.map((card) => (
              <EventCard key={card._id} data={card} />
            ))}
          </ul>
        )}
      </div>

      <div className="px-10 py-5 flex flex-col gap-3">
        <div>
          <h1 className="text-xl font-semibold">Your Cards</h1>
          <p>All the cards you've created</p>
        </div>
        {myCards.length === 0 ? (
          "No cards yet"
        ) : (
          <ul className="flex gap-2 flex-wrap">
            {myCards.map((card) => (
              <Card key={card._id} data={card} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
