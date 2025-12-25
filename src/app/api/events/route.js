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
      isPublic,
      socialLinks
    } = body;

    // Validation
    if (!slug || !userId || !host || !title || !date || !time || !location || !coverImage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
    }

    const event = await Event.create({
      slug,
      userId,
      host,
      title,
      description,
      date: new Date(date),
      time,
      location,
      coverImage,
      font,
      background,
      rsvp: rsvp ?? true,
      sections,
      commentsEnabled: commentsEnabled ?? false,
      isPublic: isPublic ?? false,
      socialLinks,
      comments: [],
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const explore = searchParams.get("explore"); // ✨ Optional: fetch public events

    let filter = {};
    if (userId) {
      filter = { userId };
    } else if (explore === "true") {
      filter = { isPublic: true }; // Only show public events on explore page
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}