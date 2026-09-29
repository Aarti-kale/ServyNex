import mongoose from "mongoose";

const becomeProfessionalSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      default: "become-professional-cta",
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    buttonText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    registrationRoute: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const BecomeProfessional = mongoose.model(
  "BecomeProfessional",
  becomeProfessionalSchema
);

export default BecomeProfessional;
