import Image from "next/image";
import Link from "next/link";
import React from "react";

const Card = ({ data }) => {
  const { title, image, createdAt } = data;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Example output: "12 December 2025"

  return (
    <Link href={`/card/${data.slug}`}>
      <div className="flex flex-col gap-3 cursor-pointer p-5 hover:bg-gray-300 w-fit transition duration-200">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="h-70 w-70 object-cover"
        />
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-800 flex gap-2 items-center">
          Created {formattedDate}
        </p>
      </div>
    </Link>
  );
};

export default Card;
