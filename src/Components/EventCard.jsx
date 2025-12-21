import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import { toast } from "sonner";
import ShareButton from "./ShareButton";
import { usePathname } from "next/navigation";

const EventCard = ({ data, onDelete }) => {
  const { title, coverImage, host, date } = data;
  const pathname = usePathname();
  const isExplorePage = pathname === "/explore";

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const toastId = toast.loading("Deleting event...");

    try {
      const response = await fetch(`/api/events/${data.slug}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete");
      }
      if (onDelete) {
        onDelete(data.slug);
      }
      toast.success("Event deleted", { id: toastId });

    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleCopy = async () => {
    const url = `${window.location.origin}/event/${data.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative flex flex-col min-w-70 max-w-70 gap-3 cursor-pointer p-4  hover:bg-gray-800/80 text-white w-fit transition duration-200">
      {!isExplorePage && (

        <Menubar className="absolute top-6 right-6 z-20 cursor-pointer border-none rounded-full h-8 w-8 bg-gray-700/90 flex items-center justify-center hover:bg-gray-700 transition duration-300 shadow-none">
          <MenubarMenu>
            <MenubarTrigger
              className="cursor-pointer bg-transparent border-none p-0 focus:bg-transparent data-[state=open]:bg-transparent outline-none ring-0 focus:ring-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
              </svg>
            </MenubarTrigger>

            <MenubarContent className="bg-gray-900 border border-white/10 font-semibold text-white shadow-2xl backdrop-blur-md">
              <Link href={`/event/${data.slug}`}>
                <MenubarItem className="cursor-pointer focus:bg-white/10 focus:text-white transition duration-200">
                  Open
                </MenubarItem>
              </Link>

              <MenubarItem
                className="cursor-pointer focus:bg-white/10 focus:text-white transition duration-200"
                onClick={handleCopy}
              >
                Copy URL to Share
              </MenubarItem>

              <a href={`/edit/event/${data.slug}`}>
                <MenubarItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                  Edit Card
                </MenubarItem>
              </a>

              <div className="h-[1px] bg-white/10 my-1" />


              <MenubarItem
                onClick={handleDelete}
                className="cursor-pointer focus:bg-red-500/10 focus:text-red-500 transition duration-200 text-red-500"
              >
                Delete
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}

      <div className="absolute top-4 left-4 z-30 scale-75">
        <ShareButton />
      </div>
      <Link href={`/event/${data.slug}`}>

        <div className="relative">

          <Image
            src={coverImage}
            alt={title}
            width={400}
            height={300}
            objectFit="cover"
            className="object-cover h-60 w-70"
          />

          <span className="bg-black-1 text-white px-4 py-1 absolute bottom-2 left-2">{formattedDate}</span>
        </div>

        <div className='flex flex-col gap-1 mt-2'>
          <h2 className="text-lg md:text-xl font-bold line-clamp-1">{title}</h2>
          <p className="text-gray-400 font-semibold flex gap-2 text-sm items-center">
            Hosted by{" "}
            <Image
              src={host.avatar}
              alt={host.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="font-bold text-gray-300">
              {host.name}
            </span>
          </p>
        </div>


      </Link>
    </div>

  );
};

export default EventCard;
