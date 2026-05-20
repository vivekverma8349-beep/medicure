import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    purpose: String,

    dosage: String,

    timing: String,

    duration: String,

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
medicineSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Medicine", medicineSchema);
