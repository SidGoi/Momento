import { connectDB } from "lib/db";
import Event from "models/Event";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // 1. FIX: Await params before destructuring (Required in newer Next.js versions)
    const resolvedParams = await params; 
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is missing" },
        { status: 400 }
      );
    }

    // 2. Find the event
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      console.log(`Event with slug "${slug}" not found`);
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // 3. Success
    return NextResponse.json(event, { status: 200 });

  } catch (error) {
    console.error("GET EVENT ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // 1. Await params for Next.js 15 compatibility
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    console.log("Attempting to delete event with slug:", slug);

    const deletedEvent = await Event.findOneAndDelete({ slug });

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });

  } catch (error) {
    // Check your terminal for this specific log!
    console.error("DETAILED DELETE ERROR:", error.message);
    
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    await connectDB();


    const updatedEvent = await Event.findOneAndUpdate(
      { slug: slug },
      { $set: body },
      { new: true } // Returns the modified document
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}