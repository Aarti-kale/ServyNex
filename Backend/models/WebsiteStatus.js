import mongoose from "mongoose";

const websiteStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["online", "maintenance"],
      default: "online",
    },

    message: {
      type: String,
      default: "Website is currently running normally.",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WebsiteStatus", websiteStatusSchema);
