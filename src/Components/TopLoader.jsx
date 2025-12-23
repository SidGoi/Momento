"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingBar from "react-top-loading-bar";

export default function TopLoader() {
  const ref = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.continuousStart();

    // simulate route complete
    const timer = setTimeout(() => {
      ref.current?.complete();
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <LoadingBar
      color="#FFEF5F"   // Tailwind indigo-500 😍
      height={2}
      ref={ref}
      shadow={true}
    />
  );
}
