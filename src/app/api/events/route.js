import { connectDB } from "lib/db";
import Event from "models/Event";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    

    // 🔥 Validate required fields
    if (!body.title || !body.date || !body.coverImage || !body.userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await Event.create({
      ...body,
      date: new Date(body.date), // ✅ FIX date issue
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

    // Read query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let events;

    if (userId) {
      // Get events of specific user
      events = await Event.find({ userId }).sort({ createdAt: -1 });
    } else {
      // Get all events
      events = await Event.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

