// models/Report.js

import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    patientName: String,

    doctorName: String,

    hospitalName: String,

    department: String,

    visitDate: String,

    nextVisitDate: String,

    reportParagraph: String,

    shortSummary: String,

    extractedText: String,

    reportFileUrl: String,

    reportFileName: String,

    diseases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disease",
      },
    ],

    medicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],

    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],

    reportsIncluded: [String],
  },
  {
    timestamps: true,
  }
);

// Unique index — same report (same user + same extracted text) must not be saved twice.
// Mirrors the unique index pattern used in Disease, Medicine and Test models.
medicalReportSchema.index(
  { user: 1, extractedText: 1 },
  {
    unique: true,
    sparse: true, // sparse = safe when extractedText is empty (scanned images)
  }
);

// Unique index on fileName — fallback duplicate prevention for scanned images
// where OCR returns empty text. sparse = safe when fileName is missing.
medicalReportSchema.index(
  { user: 1, reportFileName: 1 },
  {
    unique: true,
    sparse: true,
  }
);

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);

export default MedicalReport;