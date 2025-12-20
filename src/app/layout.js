// src/app/layout.js or RootLayout.js
import { Poppins, Pacifico, Patua_One, Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Configure fonts
export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
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


export const metadata = {
  title: "Momento",
  description: "Create, Connect & Celebrate!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* Default font can be Poppins */}
        <body className={poppins.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
