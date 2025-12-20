"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import { toast } from "sonner";

const Card = ({ data, onDelete }) => {
  const { title, image, createdAt, slug } = data;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleCopy = async (e) => {
    e.preventDefault(); // Prevent link navigation
    const url = `/api/cards/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
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

      if (onDelete) onDelete(slug); // Update parent state
      toast.success("Card deleted", { id: toastId });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="relative p-3 min-w-60 max-w-60 rounded-2xl overflow-hidden cursor-pointer group">
    
      <Menubar className={'absolute top-5 right-5 z-20 cursor-pointer border-none rounded-full h-8 w-8  flex items-center justify-center hover:bg-gray-500/50 active:bg-gray-500/100 transition duration-300'}>
        <MenubarMenu>
          <MenubarTrigger className={'cursor-pointer'}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
            </svg>
          </MenubarTrigger>
          <MenubarContent className={'bg-gray-900 border-none font-semibold text-white'}>
            <Link href={`/card/${slug}`}>
              <MenubarItem className={'cursor-pointer'}>Open</MenubarItem>
            </Link>
            <MenubarItem className={'cursor-pointer'} onClick={handleCopy}>
              Copy URL to Share
            </MenubarItem>
            <MenubarItem onClick={handleDelete} className={'cursor-pointer text-red-500'}>
              Delete
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Card Content */}
      <Link href={`/card/${slug}`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover scale-110 blur-md group-hover:blur-xl transition duration-300"
        />
        <div className="absolute inset-0 bg-black/60 hover:bg-black/70"></div>

        <div className="relative z-10 h-full flex flex-col justify-center gap-3 text-white">
          <Image
            src={image}
            alt={title}
            width={160}
            height={160}
            className="rounded-xl w-60 h-60 object-cover shadow-lg"
          />
          <div className="flex gap-1 flex-col">
            <h2 className="text-lg md:text-md font-bold line-clamp-1">{title}</h2>
            <p className="text-xs md:text-sm text-gray-200">
              Created {formattedDate}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;