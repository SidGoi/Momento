"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import { toast } from "sonner";
import ShareButton from "./ShareButton";

const Card = ({ data, onDelete }) => {
  const { title, image, createdAt, slug } = data;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/card/${slug}`;

  // Combined Share Logic: Native Share -> Clipboard Fallback
  const handleShare = async (e) => {
    e.preventDefault();

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this card: ${title}`,
          url: url,
        });
      } catch (err) {
        console.log("Share failed or cancelled");
      }
    } else {
      // Fallback for browsers that don't support native share (Desktop)
      try {
        await navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy URL");
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this card?")) return;

    const toastId = toast.loading("Deleting card...");

    try {
      const response = await fetch(`/api/cards/${slug}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete");

      if (onDelete) onDelete(slug);
      toast.success("Card deleted", { id: toastId });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="relative p-3 min-w-60 max-w-60 rounded-2xl overflow-hidden cursor-pointer group">

      {/* Menu Overlay */}
      <Menubar className="absolute top-5 right-5 z-20 cursor-pointer border-none rounded-full h-8 w-8 flex items-center justify-center bg-black/20 hover:bg-black/50 transition duration-300">
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer focus:bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
            </svg>
          </MenubarTrigger>
          <MenubarContent className="bg-gray-900 border border-white/10 font-semibold text-white min-w-40">
            <Link href={`/card/${slug}`}>
              <MenubarItem className="cursor-pointer focus:bg-white/10">Open</MenubarItem>
            </Link>

            <MenubarItem className="cursor-pointer focus:bg-white/10" onClick={handleShare}>
              Share Card
            </MenubarItem>
            <a href={`/edit/card/${slug}`}>
              <MenubarItem className="cursor-pointer focus:bg-white/10" >
                Edit Card
              </MenubarItem>
            </a>
            <div className="h-[1px] bg-white/10 my-1" />

            <MenubarItem onClick={handleDelete} className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500">
              Delete
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
      </Menubar>
<div className="absolute top-3 left-3 z-30 scale-75">
          <ShareButton />
</div>
      {/* Card Content */}
      <a href={`/card/${slug}`}>
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
          {/* Blurred Background Image */}
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover scale-125 blur-md group-hover:blur-xl transition duration-500"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

          {/* Actual Foreground Image */}
          <div className="relative z-10 h-full p-3 flex flex-col justify-between">
            <div className="relative w-full aspect-square">
              <Image
                src={image}
                alt={title}
                fill
                className="rounded-lg object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-0.5 text-white">
          <h2 className="text-lg md:text-xl font-bold line-clamp-1">{title}</h2>
          <p className="text-sm md:text-md text-gray-400">
            Created {formattedDate}
          </p>
        </div>
      </a>
    </div>
  );
};

export default Card;  