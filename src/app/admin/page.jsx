"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AdminPanel() {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn || !user) return;

  if (user.publicMetadata?.role !== "admin") {
    return (
      <div className="text-red-600 text-center mt-20 text-xl">
        ❌ You are not authorized
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Admin Panel 🚀</h1>
      <Link href="/admin/background/" className="text-blue-500 underline">Background</Link>
    </div>
  );
}
