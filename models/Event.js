import mongoose from "mongoose";

/* ---------------- Section Schema ---------------- */
const SectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
});

/* ---------------- Comment Schema ---------------- */
const CommentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    username: { type: String, required: true },
    userIcon: { type: String }, // avatar / profile icon
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* ---------------- Event Schema ---------------- */
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

    // 🕒 NEW: Event Time
    time: { type: String, required: true }, 
    // example: "07:30 PM"

    location: { type: String, required: true },
    coverImage: { type: String, required: true },

    font: {
      type: Object,
      default: { heading: "Playfair_Display", body: "Inter" },
    },

    background: {
      type: Object,
      default: {
        name: {
          type: String,
          required: true,
          unique: true,
          trim: true,
        },
        theme: {
          type: String,
          enum: ["light", "dark"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    },

    rsvp: {
      type: Boolean,
      default: false,
    },

    sections: [SectionSchema],

    /* 💬 Comment System */
    commentsEnabled: {
      type: Boolean,
      default: true,
    },

    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model("Event", EventSchema);
