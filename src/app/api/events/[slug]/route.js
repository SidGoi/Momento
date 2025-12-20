import { connectDB } from "lib/db";
import Event from "models/Event";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  await connectDB();

  const { slug } = await params;

  try {
    const event = await Event.findOne({ slug });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
