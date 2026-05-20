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

// FIX: If text extraction returned empty/short text (e.g. scanned PDF, image),
// skip keyword validation and let Gemini decide — it can read the file visually.
const isMedicalReport = (text) => {
  text = String(text || "");

  // If text is too short, don't block — let Gemini handle it
  if (text.trim().length < 30) return true;

  const lowerText = text.toLowerCase();
  const matchCount = MEDICAL_KEYWORDS.filter((kw) =>
    lowerText.includes(kw.toLowerCase())
  ).length;

  // Require at least 2 medical keyword matches
  return matchCount >= 2;
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

    // UPLOAD FILE (after validation passes)
    const uploadedFile = await upload(file);

    // Enhanced AI prompt
    const prompt = `You are an advanced medical prescription reading assistant.

Your task:

1. Analyze the uploaded medical report or handwritten prescription carefully.
2. Use both OCR extracted text and visual understanding.
3. Identify:
   - diseases
   - medicines
   - medical tests
   - doctor recommendations
4. If handwriting is unclear:
   - provide best possible interpretation
   - mark uncertain words with '(unclear)'
   - never hallucinate medicine names
5. Return confidence level for each extracted item.
6. If image is not a medical document, clearly respond: NOT_A_MEDICAL_REPORT

Return ONLY valid raw JSON. Do NOT write markdown, explanation, notes, or extra text.

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

OCR Extracted Text:
${extractedText}

Now analyze carefully.`;

    // GEMINI RESPONSE
    const result = await gemini.generateContent(prompt);
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
    // Use extractedText as the fingerprint (same file == same text)
    const existingReport = extractedText.trim().length > 0
      ? await MedicalReport.findOne({ user: user._id, extractedText })
      : null;

    let medicalReport;

    if (existingReport) {
      // Report already exists — just make sure any new disease/medicine/test IDs are linked
      medicalReport = existingReport;

      // Merge any newly upserted IDs that aren't already on the report
      const newDiseaseIds = diseaseIds.filter(
        (id) => !existingReport.diseases.some((d) => d.toString() === id.toString())
      );
      const newMedicineIds = medicineIds.filter(
        (id) => !existingReport.medicines.some((m) => m.toString() === id.toString())
      );
      const newTestIds = testIds.filter(
        (id) => !existingReport.tests.some((t) => t.toString() === id.toString())
      );

      if (newDiseaseIds.length || newMedicineIds.length || newTestIds.length) {
        await MedicalReport.findByIdAndUpdate(existingReport._id, {
          $addToSet: {
            diseases: { $each: newDiseaseIds },
            medicines: { $each: newMedicineIds },
            tests: { $each: newTestIds },
          },
        });
      }

      // Link the existing report to any newly created diseases/medicines/tests
      await Disease.updateMany(
        { _id: { $in: diseaseIds } },
        { $addToSet: { reports: existingReport._id } }
      );
      await Medicine.updateMany(
        { _id: { $in: medicineIds } },
        { $addToSet: { reports: existingReport._id } }
      );
      await Test.updateMany(
        { _id: { $in: testIds } },
        { $addToSet: { reports: existingReport._id } }
      );

      console.log("Duplicate report detected — returning existing report:", existingReport._id);
    } else {
      // CREATE MEDICAL REPORT (first time this file is uploaded)
      medicalReport = await MedicalReport.create({
        user: user._id,
        patientName: analysis.personalDetails.patientName,
        doctorName: analysis.personalDetails.doctorName,
        hospitalName: analysis.personalDetails.hospitalName,
        department: analysis.personalDetails.department,
        visitDate: analysis.personalDetails.dateOfVisit,
        nextVisitDate: analysis.personalDetails.nextVisitDate,
        reportParagraph: analysis.reportParagraph,
        shortSummary: analysis.shortSummary,
        extractedText,
        reportFileUrl: uploadedFile.url,
        reportFileName: uploadedFile.name,
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
    }

    // RESPONSE
    res.status(200).json({
      success: true,
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
            { label: "Patient Name", value: analysis.personalDetails.patientName },
            { label: "Doctor Name", value: analysis.personalDetails.doctorName },
            { label: "Hospital", value: analysis.personalDetails.hospitalName },
            { label: "Department", value: analysis.personalDetails.department },
            { label: "Visit Date", value: analysis.personalDetails.dateOfVisit },
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
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default analyzeMedicalReport;