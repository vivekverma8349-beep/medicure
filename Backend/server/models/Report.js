// models/Report.js

import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ── Personal Details (from Gemini personalDetails) ──
    patientName:  String,
    age:          String,   // analysis.personalDetails.age
    gender:       String,   // analysis.personalDetails.gender
    doctorName:   String,
    hospitalName: String,
    department:   String,
    visitDate:    String,   // maps from analysis.personalDetails.dateOfVisit
    nextVisitDate: String,

    // ── Report Content ──
    reportParagraph: String,
    shortSummary:    String,
    extractedText:   String,

    // ── File Info ──
    reportFileUrl:  String,
    reportFileName: String,

    // ── Handwriting Info ──
    isHandwritten:        { type: Boolean, default: false },
    handwritingConfidence: { type: String, default: "high" },

    // ── Linked Collections ──
    diseases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Disease" }],
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
    tests:     [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],

    // ── Lab values / report entries included (plain strings) ──
    reportsIncluded: [String],
  },
  {
    timestamps: true,
  }
);

// Unique index — same report (same user + same extracted text) must not be saved twice.
medicalReportSchema.index(
  { user: 1, extractedText: 1 },
  { unique: true, sparse: true }
);

// Unique index on fileName — fallback for scanned images where OCR returns empty text.
medicalReportSchema.index(
  { user: 1, reportFileName: 1 },
  { unique: true, sparse: true }
);

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);

export default MedicalReport;