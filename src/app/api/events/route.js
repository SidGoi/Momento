import { connectDB } from "lib/db";
import Event from "models/Event";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      slug,
      userId,
      host,
      title,
      description,
      date,
      time,
      location,
      coverImage,
      font,
      background,
      rsvp,
      sections,
      commentsEnabled,
    } = body;

    // 🔥 Required validation
    if (
      !slug ||
      !userId ||
      !host ||
      !title ||
      !description ||
      !date ||
      !time ||
      !location ||
      !coverImage
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ❌ Prevent duplicate slug
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return NextResponse.json(
        { message: "Event with this slug already exists" },
        { status: 409 }
      );
    }

    const event = await Event.create({
      slug,
      userId,
      host,
      title,
      description,
      date: new Date(date), // ✅ correct date handling
      time,
      location,
      coverImage,
      font,
      background,
      rsvp,
      sections,
      commentsEnabled: commentsEnabled ?? true, // default true
      comments: [], // 🔒 never accept comments on create
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("EVENT CREATE ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const filter = userId ? { userId } : {};

    const events = await Event.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
