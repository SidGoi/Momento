import Image from "next/image";
import Link from "next/link";
import React from "react";

const Card = ({ data }) => {
  const { title, image, createdAt, slug } = data;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/card/${slug}`}>
      <div className="relative p-3 max-w-60 rounded-2xl overflow-hidden cursor-pointer group">

        <Image
          src={image}
          alt={title}
          fill
          className="object-cover scale-110 blur-md group-hover:blur-xl transition duration-300"
        />

        <div className="absolute inset-0 bg-black/60 hover:bg-black/70"></div>

        <div className="relative z-10 h-full flex flex-col  justify-center gap-3 text-white">

          {/* Main Image */}
          <Image
            src={image}
            alt={title}
            width={160}
            height={160}
            className="rounded-xl w-60 h-60 object-cover shadow-lg"
          />
          <div className="flex gap-1 flex-col">
            <h2 className="text-md font-bold line-clamp-1">{title}</h2>
            <p className="text-sm text-gray-200">
              Created {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
