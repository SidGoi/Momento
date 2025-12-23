// src/app/layout.js or RootLayout.js
import {
  Poppins,
  Pacifico,
  Patua_One,
  Bebas_Neue,
  Space_Mono,
  Quicksand,
  Nabla,
  Luckiest_Guy,
} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import TopLoader from "@/Components/TopLoader";
const nabla = Nabla({
  subsets: ["latin"],
  variable: "--font-nabla",
});
// Configure fonts
export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
export const quicksand = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export const patuaOne = Patua_One({
  weight: "400",
  subsets: ["latin"],
});

export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const LuckiestGuy = Luckiest_Guy({
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Momento",
  description: "Create, Connect & Celebrate!",
  icons: {
    icon: "/momento.png",
    shortcut: "/momento.png",
    apple: "/momento.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={quicksand.className}>
          <TopLoader />
          {children}
          <Toaster position="bottom-right" richColors theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
