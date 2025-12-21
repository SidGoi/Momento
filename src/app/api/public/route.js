
import { connectDB } from "lib/db";
import Event from "models/Event";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Get today's date at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('hit');
    
    // Filter criteria: 
    // 1. Must be public (ensure you have this field in your Schema)
    // 2. Date must be today or in the future (Ongoing)
    const events = await Event.find({
      // isPublic: true, // Uncomment this if you have a visibility toggle
      date: { $gte: today }
    })
    .sort({ date: 1 }) // Show soonest events first
    .lean();

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Public Events API Error:", error);
    return NextResponse.json({ error: "Failed to fetch public events" }, { status: 500 });
  }
}