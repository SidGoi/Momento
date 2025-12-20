import Image from "next/image";
import React from "react";

export default async function CardPage({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(`http://localhost:3000/api/cards/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return <div>❌ Card Not Found</div>;
      }
      throw new Error("Failed to fetch");
    }

    const data = await res.json();

    return (
      <main
        className={`relative min-h-screen overflow-hidden ${data.background.theme === "dark" ? "text-black" : "text-white"
          }`}
      >


        <video
          src={data.background?.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-black/70" /> */}

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="flex flex-col items-center justify-center gap-5">


            <span className="cursor-pointer flex items-center gap-4 text-xl">
              From
              <div className="flex items-center justify-center gap-2">
                <Image
                  src={data.host.avatar}
                  height={500}
                  width={500}
                  className="h-8 w-8 rounded-full object-cover cursor-pointer"
                  alt={data.title}
                />
                <b>{data.host.name}</b>
              </div>
            </span>

            <Image
              src={data.image}
              alt={data.title}
              height={500}
              width={500}
              className="curp w-80 h-80 object-cover rounded-xl mb-4"
            />
            <div className='flex flex-col items-center justify-center gap-1'>
              <h1
                style={{ fontFamily: data.font }}
                className="text-4xl font-bold mb-2">{data.title}</h1>
              <p className="font-medium">{data.description}</p>
            </div>


          </div>
        
        </div>

      </main>
    );
  } catch (error) {
    console.error(error);
    return <div>Something went wrong</div>;
  }
}
