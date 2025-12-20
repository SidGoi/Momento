import Image from "next/image";
import React from "react";

const EventCard = ({ data }) => {
  const { title, coverImage, createdAt, host } = data;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Example output: "12 December 2025"

  return (
    
    <div className="flex flex-col gap-3 cursor-pointer p-5 hover:bg-gray-300 w-fit transition duration-200">
      <Image
        src={coverImage}
        alt={title}
        width={400}
        height={300}
        className="h-70 w-70 object-cover"
      />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-800 flex gap-2 items-center">
        Hosted by{" "}
        <Image
          src={host.avatar}
          alt={host.name}
          width={20}
          height={20}
          className="rounded-full"
        />
        {host.name}
      </p>
    </div>
  );
};

export default EventCard;
