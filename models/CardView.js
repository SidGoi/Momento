const CardViewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },

    viewedCards: [
      {
        cardId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Card",
          required: true,
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.CardView || mongoose.model("CardView", CardViewSchema);