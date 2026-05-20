import extractText from "../utils/extractText.js";
import gemini from "../config/gemini.js";

import User from "../models/User.js";
import Disease from "../models/Disease.js";
import Medicine from "../models/Medicine.js";
import Test from "../models/Test.js";
import MedicalReport from "../models/Report.js";

import upload from "../services/imagekit.js";

// CLEAN ARRAY FUNCTION
const cleanArray = (arr = []) => {
  return arr
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .filter((item, index, self) => self.indexOf(item) === index);
};

// NEW FEATURE: Medical report validation keywords
const MEDICAL_KEYWORDS = [
  "hemoglobin", "patient", "prescription", "tablet", "blood",
  "mg/dl", "hospital", "lab", "test", "diagnosis", "doctor",
  "clinic", "report", "medicine", "mg", "dose", "capsule",
  "serum", "glucose", "platelet", "wbc", "rbc", "urine",
  "creatinine", "cholesterol", "thyroid", "insulin", "x-ray",
  "mri", "ct scan", "ultrasound", "ecg", "pathology",
  "pharmacy", "discharge", "admitted", "ward", "icu",
  "bp", "pulse", "temperature", "weight", "height",
];

// NEW FEATURE: Check if extracted text looks like a medical document
const isMedicalReport = (text) => {
  // safely convert anything to string
  text = String(text || "");

  if (text.trim().length < 30) return false;

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
    const extractedText = await extractText(file);

    // NEW FEATURE: Validate medical report before analysis
    if (!isMedicalReport(extractedText)) {
      return res.status(422).json({
        success: false,
        message:
          "Uploaded file does not appear to be a medical report. Please upload a valid prescription, lab report, or medical document.",
      });
    }

    // UPLOAD FILE (after validation passes)
    const uploadedFile = await upload(file);

    // NEW FEATURE: Enhanced AI prompt supporting handwritten prescriptions (Feature 6)
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
  "diseasesMentioned": [],
  "medicinesPrescribed": [],
  "testsMentioned": [],
  "reportsIncluded": [],
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

    // NEW FEATURE: Check if Gemini flagged it as non-medical
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
      console.log("Invalid Gemini JSON");
      return res
        .status(500)
        .json({ success: false, message: "AI returned invalid JSON" });
    }

    // CLEAN ARRAYS
    analysis.diseasesMentioned = cleanArray(analysis.diseasesMentioned);
    analysis.medicinesPrescribed = cleanArray(analysis.medicinesPrescribed);
    analysis.testsMentioned = cleanArray(analysis.testsMentioned);

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

    // NEW FEATURE (Feature 2 & 3): Upsert diseases — no duplicates, use $addToSet for reports
    const diseaseIds = [];
    for (const diseaseName of analysis.diseasesMentioned || []) {
      if (
        !diseaseName ||
        typeof diseaseName !== "string" ||
        diseaseName.trim() === ""
      )
        continue;

      const normalizedName = diseaseName.trim().toLowerCase();

      // findOneAndUpdate with upsert to prevent duplicate entry race conditions
      const disease = await Disease.findOneAndUpdate(
        { user: user._id, name: normalizedName },
        { $setOnInsert: { user: user._id, name: normalizedName } },
        { upsert: true, new: true }
      );

      diseaseIds.push(disease._id);
    }

    // NEW FEATURE (Feature 2 & 3): Upsert medicines
    const medicineIds = [];
    for (const medicineName of analysis.medicinesPrescribed || []) {
      if (
        !medicineName ||
        typeof medicineName !== "string" ||
        medicineName.trim() === ""
      )
        continue;

      const normalizedName = medicineName.trim().toLowerCase();

      const medicine = await Medicine.findOneAndUpdate(
        { user: user._id, name: normalizedName },
        { $setOnInsert: { user: user._id, name: normalizedName } },
        { upsert: true, new: true }
      );

      medicineIds.push(medicine._id);
    }

    // NEW FEATURE (Feature 2 & 3): Upsert tests
    const testIds = [];
    for (const testName of analysis.testsMentioned || []) {
      if (
        !testName ||
        typeof testName !== "string" ||
        testName.trim() === ""
      )
        continue;

      const normalizedName = testName.trim().toLowerCase();

      const test = await Test.findOneAndUpdate(
        { user: user._id, name: normalizedName },
        { $setOnInsert: { user: user._id, name: normalizedName } },
        { upsert: true, new: true }
      );

      testIds.push(test._id);
    }

    // CREATE MEDICAL REPORT
    const medicalReport = await MedicalReport.create({
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

    // NEW FEATURE (Feature 3): Link report to diseases/medicines/tests using $addToSet (no duplicate refs)
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

    // RESPONSE — always show full analysis result to user
    res.status(200).json({
      success: true,

      // NEW FEATURE: Include handwriting confidence info
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
            {
              label: "Patient Name",
              value: analysis.personalDetails.patientName,
            },
            {
              label: "Doctor Name",
              value: analysis.personalDetails.doctorName,
            },
            {
              label: "Hospital",
              value: analysis.personalDetails.hospitalName,
            },
            {
              label: "Department",
              value: analysis.personalDetails.department,
            },
            {
              label: "Visit Date",
              value: analysis.personalDetails.dateOfVisit,
            },
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
