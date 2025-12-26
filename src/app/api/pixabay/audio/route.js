import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "background";

  const url = `https://pixabay.com/api/music/?key=${process.env.PIXABAY_API_KEY}&q=${q}&per_page=10`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Momento-App/1.0",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Pixabay request failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
