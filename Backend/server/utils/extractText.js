import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    detectedDiseases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disease",
      },
    ],

    detectedMedicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],

    detectedTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],

    // FIXED SECTION
    reportsIncluded: [
      {
        name: {
          type: String,
          default: "",
        },

        value: {
          type: String,
          default: "",
        },

        confidence: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
      },
    ],

    shortSummary: {
      type: String,
      default: "",
    },

    handwritingConfidence: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    isHandwritten: {
      type: Boolean,
      default: false,
    },

    aiResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const MedicalReport = mongoose.model(
  "MedicalReport",
  medicalReportSchema
);

export default MedicalReport;