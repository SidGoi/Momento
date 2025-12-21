import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
});

const CommentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    username: { type: String, required: true },
    userIcon: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    host: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      id: { type: String, required: true },
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    location: { type: String, required: true },
    coverImage: { type: String, required: true },
    font: {
      heading: { type: String, default: "Poppins" },
      body: { type: String, default: "Inter" },
    },
    background: {
      name: { type: String, required: true },
      theme: { type: String, enum: ["light", "dark"], required: true },
      url: { type: String, required: true },
    },
    rsvp: { type: Boolean, default: true },
    sections: [SectionSchema],
    commentsEnabled: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false }, // ✨ NEW: Visibility toggle
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);