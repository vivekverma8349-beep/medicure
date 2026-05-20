import extractText from "../utils/extractText.js";
import gemini from "../config/gemini.js";

import User from "../models/User.js";
import Disease from "../models/Disease.js";
import Medicine from "../models/Medicine.js";
import Test from "../models/Test.js";
import MedicalReport from "../models/Report.js";

import upload from "../services/imagekit.js";

// CLEAN ARRAY FUNCTION
// Handles both plain strings and objects Gemini occasionally returns
const extractName = (item) => {
  if (typeof item === "string") return item.trim();
  if (item && typeof item === "object") {
    // Try common key names Gemini uses for each field type
    const val =
      item.diseaseName ||
      item.medicineName ||
      item.testName ||
      item.reportName ||
      item.name ||
      item.label ||
      Object.values(item).find((v) => typeof v === "string" && v.trim());
    return typeof val === "string" ? val.trim() : "";
  }
  return "";
};

const cleanArray = (arr = []) => {
  return arr
    .map(extractName)
    .filter((item) => item !== "")
    .filter((item, index, self) => self.indexOf(item) === index);
};

// Normalize reportsIncluded — Gemini sometimes returns objects with result/referenceRange
const normalizeReportsIncluded = (arr = []) => {
  return arr
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const name = item.reportName || item.testName || item.name || "";
        const result = item.result || "";
        const ref = item.referenceRange || "";
        const parts = [name, result && `Result: ${result}`, ref && `Ref: ${ref}`]
          .filter(Boolean)
          .join(" | ");
        return parts.trim();
      }
      return "";
    })
    .filter((s) => s !== "");
};

// Medical report validation keywords
const MEDICAL_KEYWORDS = [
  "hemoglobin", "patient", "prescription", "tablet", "blood",
  "mg/dl", "hospital", "lab", "test", "diagnosis", "doctor",
  "clinic", "report", "medicine", "mg", "dose", "capsule",
  "serum", "glucose", "platelet", "wbc", "rbc", "urine",
  "creatinine", "cholesterol", "thyroid", "insulin", "x-ray",
  "mri", "ct scan", "ultrasound", "ecg", "pathology",
  "pharmacy", "discharge", "admitted", "ward", "icu",
  "bp", "pulse", "temperature", "weight", "height",
  "diabetes", "hypertension", "metformin", "hba1c", "fasting",
  "sugar", "pressure", "endocrinology", "department", "visit",
];

// FIX: If text extraction returned empty/short text (e.g. scanned PDF, handwritten image),
// skip keyword validation and let Gemini decide — it can read the file visually.
const isMedicalReport = (text) => {
  text = String(text || '');

  // If text is short (OCR failed / handwritten), don't block — Gemini will analyze visually
  if (text.trim().length < 100) return true;

  const lowerText = text.toLowerCase();
  const matchCount = MEDICAL_KEYWORDS.filter((kw) =>
    lowerText.includes(kw.toLowerCase())
  ).length;

  // Require at least 1 medical keyword match (was 2 — loosened for handwritten docs)
  return matchCount >= 1;
};

// ANALYZE MEDICAL REPORT
const analyzeMedicalReport = async (req, res) => {
  try {
    // CHECK USER
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = req.user;

    // CHECK FILE
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No report uploaded" });
    }

    // EXTRACT TEXT
    const rawExtracted = await extractText(file);
    // Safely coerce to string — extractText may return non-string values on failure
    const extractedText = typeof rawExtracted === "string" ? rawExtracted : String(rawExtracted ?? "");

    console.log("EXTRACTED TEXT LENGTH:", extractedText.length);
    console.log("EXTRACTED TEXT PREVIEW:", extractedText.slice(0, 200));

    // Validate medical report — now lenient when text extraction returns nothing
    if (!isMedicalReport(extractedText)) {
      return res.status(422).json({
        success: false,
        message:
          "Uploaded file does not appear to be a medical report. Please upload a valid prescription, lab report, or medical document.",
      });
    }

    // ─── EARLY DUPLICATE CHECK ────────────────────────────────────────────────
    // Run BEFORE Gemini AI call and BEFORE ImageKit upload to save cost & time.
    // Same file → same extractedText OR same originalname → return stored result.
    let earlyDuplicate = null;

    if (extractedText.trim().length > 0) {
      earlyDuplicate = await MedicalReport.findOne({ user: user._id, extractedText })
        .populate("diseases")
        .populate("medicines")
        .populate("tests");
    }

    if (!earlyDuplicate && file.originalname) {
      earlyDuplicate = await MedicalReport.findOne({
        user: user._id,
        reportFileName: file.originalname,
      })
        .populate("diseases")
        .populate("medicines")
        .populate("tests");
    }

    if (earlyDuplicate) {
      console.log("Early duplicate detected — skipping Gemini. Returning stored report:", earlyDuplicate._id);

      // If the existing report is missing its file URL (saved before the imagekit fix),
      // upload the file now and patch the DB so the button shows next time.
      let fileUrl = earlyDuplicate.reportFileUrl || null;
      let fileName = earlyDuplicate.reportFileName || null;

      if (!fileUrl) {
        try {
          const uploadedFile = await upload(file);
          fileUrl  = uploadedFile.url;
          fileName = uploadedFile.name;
          await MedicalReport.findByIdAndUpdate(earlyDuplicate._id, {
            reportFileUrl:  fileUrl,
            reportFileName: fileName,
          });
          console.log("Patched missing reportFileUrl on existing report:", fileUrl);
        } catch (uploadErr) {
          console.log("Could not upload file for URL patch:", uploadErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        duplicate: true,
        reportFileUrl: fileUrl,
        handwritingInfo: {
          isHandwritten: earlyDuplicate.isHandwritten || false,
          confidence: earlyDuplicate.handwritingConfidence || "high",
        },
        sections: [
          { type: "summary",   title: "Summary",           content: earlyDuplicate.shortSummary },
          {
            type: "patient", title: "Patient Details",
            content: [
              { label: "Patient Name", value: earlyDuplicate.patientName },
              { label: "Age",          value: earlyDuplicate.age },
              { label: "Gender",       value: earlyDuplicate.gender },
              { label: "Doctor Name",  value: earlyDuplicate.doctorName },
              { label: "Hospital",     value: earlyDuplicate.hospitalName },
              { label: "Department",   value: earlyDuplicate.department },
              { label: "Visit Date",   value: earlyDuplicate.visitDate },
              { label: "Next Visit",   value: earlyDuplicate.nextVisitDate },
            ],
          },
          { type: "analysis",         title: "Detailed Analysis",    content: earlyDuplicate.reportParagraph },
          { type: "diseases",         title: "Diseases Detected",    content: earlyDuplicate.diseases.map((d) => d.name) },
          { type: "medicines",        title: "Medicines Prescribed", content: earlyDuplicate.medicines.map((m) => m.name) },
          { type: "tests",            title: "Tests Mentioned",      content: earlyDuplicate.tests.map((t) => t.name) },
          { type: "reportsIncluded",  title: "Lab Results",          content: earlyDuplicate.reportsIncluded || [] },
        ],
      });
    }

    // ─────────────────────────────────────────────────────────────────────────

    // UPLOAD FILE (after duplicate check passes — only for new reports)
    const uploadedFile = await upload(file);

    const prompt = `You are an expert medical document reader with advanced vision capabilities.

You will receive:
1. A medical document image (may be handwritten prescription, printed lab report, or scanned document)
2. OCR extracted text (may be empty or garbled for handwritten documents — IGNORE if unclear)

Your primary task is to VISUALLY analyze the image directly.
Do NOT rely solely on the OCR text — especially for handwritten prescriptions where doctor's handwriting may be unclear.

Instructions:
- READ the image carefully using visual analysis
- For handwritten text: interpret to the best of your ability, mark uncertain words with (unclear)
- Extract ALL medical information visible in the image
- NEVER hallucinate medicine names or dosages — only extract what is actually visible
- If unsure about a word, include your best guess with (unclear) suffix

IMPORTANT: Only return NOT_A_MEDICAL_REPORT if the image is CLEARLY not a medical document
(e.g. a selfie, a food photo, a landscape). Poor handwriting does NOT make it non-medical.
Handwritten prescriptions ARE valid medical documents even if OCR text is empty or garbled.

Return ONLY valid raw JSON. No markdown, no explanation, no extra text.

CRITICAL RULES for arrays:
- "diseasesMentioned" must be an array of PLAIN STRINGS only. Example: ["Type 2 Diabetes", "Hypertension"]
- "medicinesPrescribed" must be an array of PLAIN STRINGS only. Example: ["Metformin 500mg twice daily", "Vitamin D3 weekly"]
- "testsMentioned" must be an array of PLAIN STRINGS only. Example: ["HbA1c", "Fasting Blood Sugar"]
- "reportsIncluded" must be an array of PLAIN STRINGS only. Example: ["HbA1c: 8.2% (Ref: below 5.7%)", "Cholesterol: 224 mg/dL (Ref: below 200 mg/dL)"]
- Do NOT put objects inside these arrays. Only plain strings.

Return strictly this structure:

{
  "personalDetails": {
    "patientName": "",
    "age": "",
    "gender": "",
    "doctorName": "",
    "hospitalName": "",
    "department": "",
    "dateOfVisit": "",
    "nextVisitDate": ""
  },
  "reportParagraph": "",
  "diseasesMentioned": ["plain string"],
  "medicinesPrescribed": ["plain string"],
  "testsMentioned": ["plain string"],
  "reportsIncluded": ["plain string"],
  "shortSummary": "",
  "handwritingConfidence": "high|medium|low",
  "isHandwritten": false
}

OCR Extracted Text (may be empty or garbled for handwritten docs — use image for visual analysis):
${extractedText || '(no OCR text — rely entirely on visual analysis of the image)'}

Now carefully analyze the image and return the JSON.`;

    // GEMINI CALL — Multimodal: send image + OCR text together
    // This allows Gemini to VISUALLY read handwritten prescriptions
    // regardless of how bad the OCR extraction was.
    const imagePart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype || 'image/jpeg',
      },
    };

    const result = await gemini.generateContent([prompt, imagePart]);
    const response = result.response.text();

    // Check if Gemini flagged it as non-medical
    if (response.includes("NOT_A_MEDICAL_REPORT")) {
      return res.status(422).json({
        success: false,
        message:
          "Uploaded file does not appear to be a medical report. Please upload a valid prescription, lab report, or medical document.",
      });
    }

    // CLEAN RESPONSE
    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("CLEANED RESPONSE:");
    console.log(cleanedResponse);

    // PARSE JSON SAFELY
    let analysis;
    try {
      analysis = JSON.parse(cleanedResponse);
    } catch (err) {
      console.log("Invalid Gemini JSON:", cleanedResponse);
      return res
        .status(500)
        .json({ success: false, message: "AI returned invalid JSON" });
    }

    // CLEAN ARRAYS — handles both plain strings and objects from Gemini
    analysis.diseasesMentioned = cleanArray(analysis.diseasesMentioned);
    analysis.medicinesPrescribed = cleanArray(analysis.medicinesPrescribed);
    analysis.testsMentioned = cleanArray(analysis.testsMentioned);
    analysis.reportsIncluded = normalizeReportsIncluded(analysis.reportsIncluded);

    // UPDATE USER
    if (!user.name && analysis.personalDetails.patientName) {
      user.name = analysis.personalDetails.patientName;
    }
    if (!user.age && analysis.personalDetails.age) {
      user.age = analysis.personalDetails.age;
    }
    if (!user.gender && analysis.personalDetails.gender) {
      user.gender = analysis.personalDetails.gender;
    }
    if (!user.hospitalName && analysis.personalDetails.hospitalName) {
      user.hospitalName = analysis.personalDetails.hospitalName;
    }
    await user.save();

    // Upsert diseases
    const diseaseIds = [];
    for (const diseaseName of analysis.diseasesMentioned || []) {
      if (!diseaseName || typeof diseaseName !== "string" || diseaseName.trim() === "")
        continue;
      const normalizedName = diseaseName.trim().toLowerCase();
      try {
        const disease = await Disease.findOneAndUpdate(
          { user: user._id, name: normalizedName },
          { $setOnInsert: { user: user._id, name: normalizedName } },
          { upsert: true, new: true }
        );
        diseaseIds.push(disease._id);
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate key — record already exists, just fetch it
          const existing = await Disease.findOne({ user: user._id, name: normalizedName });
          if (existing) diseaseIds.push(existing._id);
        } else throw err;
      }
    }

    // Upsert medicines
    const medicineIds = [];
    for (const medicineName of analysis.medicinesPrescribed || []) {
      if (!medicineName || typeof medicineName !== "string" || medicineName.trim() === "")
        continue;
      const normalizedName = medicineName.trim().toLowerCase();
      try {
        const medicine = await Medicine.findOneAndUpdate(
          { user: user._id, name: normalizedName },
          { $setOnInsert: { user: user._id, name: normalizedName } },
          { upsert: true, new: true }
        );
        medicineIds.push(medicine._id);
      } catch (err) {
        if (err.code === 11000) {
          const existing = await Medicine.findOne({ user: user._id, name: normalizedName });
          if (existing) medicineIds.push(existing._id);
        } else throw err;
      }
    }

    // Upsert tests
    const testIds = [];
    for (const testName of analysis.testsMentioned || []) {
      if (!testName || typeof testName !== "string" || testName.trim() === "")
        continue;
      const normalizedName = testName.trim().toLowerCase();
      try {
        const test = await Test.findOneAndUpdate(
          { user: user._id, name: normalizedName },
          { $setOnInsert: { user: user._id, name: normalizedName } },
          { upsert: true, new: true }
        );
        testIds.push(test._id);
      } catch (err) {
        if (err.code === 11000) {
          const existing = await Test.findOne({ user: user._id, name: normalizedName });
          if (existing) testIds.push(existing._id);
        } else throw err;
      }
    }

    // DUPLICATE REPORT CHECK — prevent saving the same report twice
    // Primary fingerprint: extractedText (same file text = same document)
    // Fallback fingerprint: reportFileName (for scanned images where OCR returns nothing)
    let existingReport = null;

    if (extractedText.trim().length > 0) {
      existingReport = await MedicalReport.findOne({ user: user._id, extractedText });
    }

    if (!existingReport && uploadedFile.name) {
      existingReport = await MedicalReport.findOne({
        user: user._id,
        reportFileName: uploadedFile.name,
      });
    }

    // Helper to link IDs and merge onto an existing report
    const linkToExisting = async (report) => {
      const newDiseaseIds = diseaseIds.filter(
        (id) => !report.diseases.some((d) => d.toString() === id.toString())
      );
      const newMedicineIds = medicineIds.filter(
        (id) => !report.medicines.some((m) => m.toString() === id.toString())
      );
      const newTestIds = testIds.filter(
        (id) => !report.tests.some((t) => t.toString() === id.toString())
      );

      if (newDiseaseIds.length || newMedicineIds.length || newTestIds.length) {
        await MedicalReport.findByIdAndUpdate(report._id, {
          $addToSet: {
            diseases: { $each: newDiseaseIds },
            medicines: { $each: newMedicineIds },
            tests: { $each: newTestIds },
          },
        });
      }

      await Disease.updateMany(
        { _id: { $in: diseaseIds } },
        { $addToSet: { reports: report._id } }
      );
      await Medicine.updateMany(
        { _id: { $in: medicineIds } },
        { $addToSet: { reports: report._id } }
      );
      await Test.updateMany(
        { _id: { $in: testIds } },
        { $addToSet: { reports: report._id } }
      );
    };

    let medicalReport;

    if (existingReport) {
      // ---- DUPLICATE: reuse the existing report ----
      console.log("Duplicate report detected — returning existing report:", existingReport._id);
      await linkToExisting(existingReport);
      medicalReport = existingReport;
    } else {
      try {
        // ---- NEW REPORT: create for the first time ----
        medicalReport = await MedicalReport.create({
          user: user._id,
          // Personal details
          patientName:  analysis.personalDetails.patientName,
          age:          analysis.personalDetails.age,
          gender:       analysis.personalDetails.gender,
          doctorName:   analysis.personalDetails.doctorName,
          hospitalName: analysis.personalDetails.hospitalName,
          department:   analysis.personalDetails.department,
          visitDate:    analysis.personalDetails.dateOfVisit,
          nextVisitDate: analysis.personalDetails.nextVisitDate,
          // Report content
          reportParagraph: analysis.reportParagraph,
          shortSummary:    analysis.shortSummary,
          extractedText,
          // File info
          reportFileUrl:  uploadedFile.url,
          reportFileName: uploadedFile.name,
          // Handwriting info
          isHandwritten:         analysis.isHandwritten || false,
          handwritingConfidence: analysis.handwritingConfidence || "high",
          // Linked IDs
          diseases: diseaseIds,
          medicines: medicineIds,
          tests: testIds,
          reportsIncluded: analysis.reportsIncluded,
        });

        // Link report to diseases/medicines/tests
        await Disease.updateMany(
          { _id: { $in: diseaseIds } },
          { $addToSet: { reports: medicalReport._id } }
        );
        await Medicine.updateMany(
          { _id: { $in: medicineIds } },
          { $addToSet: { reports: medicalReport._id } }
        );
        await Test.updateMany(
          { _id: { $in: testIds } },
          { $addToSet: { reports: medicalReport._id } }
        );
      } catch (createErr) {
        // DB-level unique index violation (error code 11000)
        // This is a safety net in case the app-level check above was a race condition
        if (createErr.code === 11000) {
          console.log("DB unique index blocked duplicate report — fetching existing...");
          medicalReport =
            await MedicalReport.findOne({ user: user._id, extractedText }) ||
            await MedicalReport.findOne({ user: user._id, reportFileName: uploadedFile.name });

          if (medicalReport) {
            await linkToExisting(medicalReport);
          } else {
            throw createErr; // Shouldn't happen, but re-throw if we truly can't find it
          }
        } else {
          throw createErr;
        }
      }
    }

    // RESPONSE
    res.status(200).json({
      success: true,
      reportFileUrl: medicalReport.reportFileUrl || null,
      handwritingInfo: {
        isHandwritten: analysis.isHandwritten || false,
        confidence: analysis.handwritingConfidence || "high",
      },
      sections: [
        {
          type: "summary",
          title: "Summary",
          content: analysis.shortSummary,
        },
        {
          type: "patient",
          title: "Patient Details",
          content: [
            { label: "Patient Name",  value: analysis.personalDetails.patientName },
            { label: "Age",           value: analysis.personalDetails.age },
            { label: "Gender",        value: analysis.personalDetails.gender },
            { label: "Doctor Name",   value: analysis.personalDetails.doctorName },
            { label: "Hospital",      value: analysis.personalDetails.hospitalName },
            { label: "Department",    value: analysis.personalDetails.department },
            { label: "Visit Date",    value: analysis.personalDetails.dateOfVisit },
            { label: "Next Visit",    value: analysis.personalDetails.nextVisitDate },
          ],
        },
        {
          type: "analysis",
          title: "Detailed Analysis",
          content: analysis.reportParagraph,
        },
        {
          type: "diseases",
          title: "Diseases Detected",
          content: analysis.diseasesMentioned,
        },
        {
          type: "medicines",
          title: "Medicines Prescribed",
          content: analysis.medicinesPrescribed,
        },
        {
          type: "tests",
          title: "Tests Mentioned",
          content: analysis.testsMentioned,
        },
        {
          type: "reportsIncluded",
          title: "Lab Results",
          content: analysis.reportsIncluded || [],
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default analyzeMedicalReport;