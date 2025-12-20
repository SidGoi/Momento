import Link from "next/link";
import { Instagram, Youtube, MessageCircle } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full border-t  pt-16 pb-8 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-12">

          {/* Brand and Quote */}
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-gray-800 font-primary text-center md:text-left max-w-sm">
              Create, Connect and Celebrate with
            </p>
            <h1 className="text-5xl Nabla md:text-6xl font-nabla tracking-wider">
              MOMENTO
            </h1>
            <div className="flex gap-6">
              <Link
                href="https://wa.me/yournumber"
                className="p-3 rounded-full bg-green-500/20 text-green-500 transition-all duration-300 border border-white/10"
              >
                <MessageCircle size={24} />
              </Link>
              <Link
                href="https://instagram.com/yourprofile"
                className="p-3 rounded-full bg-pink-500/20 text-pink-500 transition-all duration-300 border border-white/10"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://youtube.com/yourchannel"
                className="p-3 rounded-full bg-red-500/20 text-red-500 transition-all duration-300 border border-white/10"
              >
                <Youtube size={24} />
              </Link>

            </div>
          </div>



        </div>

        <div className="border-t-1 mt-10 p-10 text-black-1 border-gray-600 flex flex-col md:flex-row gap-3 items-center justify-between">
          <Link href={"/"} className="flex gap-3 text-black-1 items-center justify-center">
            <Image
              src={"/momento-dark.svg"}
              alt="Momento Logo"
              height={500}
              width={500}
              className="h-6 w-auto cursor-pointer"
            />
            <h1 className="text-black-1 text-sm md:text-lg font-semibold">
              Create an event for free 🎉
            </h1>
          </Link>
          <Link href={"/"} className="text-black-1 flex gap-3 items-center justify-center">
            <h1 className="ext-black-1 font-semibold text-sm md:text-lg">Developed by</h1>
            <h1 className="text-2xl ext-black-1 font-primary">Siddharaj Gohil</h1>
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;