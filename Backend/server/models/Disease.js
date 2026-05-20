import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    severity: String,

    symptoms: [String],

    status: {
      type: String,
      default: "Active",
    },

    diagnosedOn: {
      type: Date,
      default: Date.now,
    },

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
diseaseSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Disease", diseaseSchema);
