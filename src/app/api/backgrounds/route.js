import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "lib/db";
import Background from "models/Background";

export async function POST(req) {
  try {
    await connectDB();


    const body = await req.json();

    const background = await Background.create({
      ...body,
    });

    return NextResponse.json(background, { status: 201 });
  } catch (error) {
    console.error("BACKGROUND CREATE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const backgrounds = await Background.find().sort({ createdAt: -1 });
    return NextResponse.json(backgrounds, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch backgrounds" },
      { status: 500 }
    );
  }
}
