import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    module: {
      type: String,
      enum: [
        "profile",
        "user",
        "worker",
        "booking",
        "service",
        "category",
        "review",
        "payment",
        "website",
      ],
      default: "profile",
    },
  },
  {
    timestamps: true,
  }
);

adminActivitySchema.index({
  admin: 1,
  createdAt: -1,
});

export default mongoose.model("AdminActivityLog", adminActivitySchema);
