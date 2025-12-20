import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error("Mongo URI missing");

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.promise = mongoose.connect(MONGO_URI);
  cached.conn = await cached.promise;

  console.log("Connected!");
  return cached.conn;
}
