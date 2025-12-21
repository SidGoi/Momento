import { connectDB } from "lib/db";
import Event from "models/Event";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    // 1. Await params (Required in newer Next.js versions)
    const { slug } = await params; 

    // 2. Parse the body safely
    const body = await req.json();
    const { message, username, userIcon } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 3. Database connection
    await connectDB();

    // 4. Update the document
    // We use findOneAndUpdate with $push and { new: true } to be more atomic
    const updatedEvent = await Event.findOneAndUpdate(
      { slug: slug },
      {
        $push: {
          comments: {
            $each: [{
              message: message.trim(),
              username: username || "Anonymous",
              userIcon: userIcon || "",
              timestamp: new Date(),
            }],
            $position: 0, // Puts new comment at the top of the array
          },
        },
      },
      { new: true } // Returns the updated document
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Return the newly added comment (the first one in the array)
    return NextResponse.json(updatedEvent.comments[0], { status: 201 });

  } catch (error) {
    console.error("POST API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to post comment", details: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   GET: Fetch Comments
========================= */
export async function GET(req, { params }) {
  try {
    const { slug } = await params; // Mandatory await in Next.js 15+
    await connectDB();

    // Fetch the event and specifically select the comments array
    const event = await Event.findOne({ slug }, { comments: 1, _id: 0 }).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Return the comments array (ensure it's an array even if empty)
    return NextResponse.json(event.comments || [], { status: 200 });
  } catch (error) {
    console.error("GET COMMENT ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}