"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import MomentoLoader from "@/Components/MomentoLoader/MomentoLoader";
import Button from "@/Components/Button";
import AdminBackgroundCard from "@/Components/AdminBackgroundCard"; // Import the card above

const BackgroundsPage = () => {
  const { user, isLoaded } = useUser();
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBackgrounds = async () => {
    try {
      const res = await fetch('/api/backgrounds');
      const data = await res.json();
      setBackgrounds(data);
    } catch (err) {
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const res = await fetch(`/api/backgrounds?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Asset removed");
        setBackgrounds(prev => prev.filter(item => item._id !== id));
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (!isLoaded || loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-black"><MomentoLoader /></div>;
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <video
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        src="https://res.cloudinary.com/dxoxlurnt/video/upload/v1766266085/web_utfj0o.mp4"
        autoPlay loop muted playsInline
      />

      <header className="flex flex-row items-center justify-between px-4 md:px-14 py-6 md:py-10 gap-4">
        <Link href="/">
          <Image src="/momento.svg" alt="Momento" height={40} width={150} className="h-9 w-auto" />
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/admin" className="text-gray-400 hover:text-white transition hidden md:block">Admin Home</Link>
          <Link href="/admin/background/create">
            <Button label="Add New Asset" variant="light" />
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="px-4 md:px-14 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Asset Library</h1>
            <p className="text-gray-400 mt-2 text-lg">Curate the backgrounds available to your users.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl">
            <span className="text-gray-400">Total Count: </span>
            <span className="font-mono font-bold text-pink-500">{backgrounds.length}</span>
          </div>
        </div>

        {backgrounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/10 rounded-[3rem] bg-black/40 backdrop-blur-sm">
            <h2 className="text-xl font-medium opacity-50">Library is currently empty</h2>
            <Link href="/admin/background/create" className="mt-4 bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition">
              Upload First Background
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {backgrounds.map((bg) => (
              <AdminBackgroundCard key={bg._id} bg={bg} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <footer className="px-14 py-10 border-t border-white/10 flex justify-between items-center opacity-40 text-[10px] uppercase tracking-widest">
        <p>© 2025 Momento Admin</p>
        <p>Built with ❤️ for Siddharaj</p>
      </footer>
    </div>
  );
};

export default BackgroundsPage;