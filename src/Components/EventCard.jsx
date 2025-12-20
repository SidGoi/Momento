import Image from "next/image";
import Link from "next/link";
import React from "react";

const EventCard = ({ data }) => {
  const { title, coverImage, createdAt, host, date } = data;

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/event/${data.slug}`}>
      <div className="flex flex-col max-w-70 gap-3 cursor-pointer p-4  hover:bg-gray-800/80 text-white w-fit transition duration-200">
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

        <div className='flex flex-col gap-1'>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-400 font-semibold flex gap-2 items-center">
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
      </div>
    </Link>

  );
};

export default EventCard;
