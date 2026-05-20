import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: String,

    description: String,

    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalReport",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// NEW FEATURE: Index for fast lookups + duplicate prevention
testSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Test", testSchema);
