"use client";
import Image from "next/image";

const images = [
  "/Cards/img1.jpg",
  "/Cards/img2.jpg",
  "/Cards/img3.jpg",
  "/Cards/img4.jpg",
  "/Cards/img5.jpg",
  "/Cards/img6.jpg",
  "/Cards/img7.jpg",
  "/Cards/img8.jpg",
  "/Cards/img9.jpg",
  "/Cards/img10.jpg",
  "/Cards/img11.jpg",
  "/Cards/img12.jpg",
];

export default function CircularImageCarousel() {
  const radius = 220; // circle radius
  const imageSize = 300;

  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center">
      {/* Rotating container */}
      <div className="absolute w-full h-full animate-spin-slow">
        {images.map((src, index) => {
          const angle = (360 / images.length) * index;

          return (
            
            <div
              key={index}
              className="absolute top-1/2 left-1/2 "
              style={{
                transform: `
                  rotate(${angle}deg)
                  translate(${radius}px)
                `,
              }}
            >
              <Image
                src={src}
                alt={`image-${index}`}
                width={imageSize}
                height={imageSize}
                className="rounded-xl h-32 w-32 shadow-lg object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
