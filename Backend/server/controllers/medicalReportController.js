// controllers/medicalReportController.js

import MedicalReport from "../models/Report.js";
import Disease from "../models/Disease.js";
import Medicine from "../models/Medicine.js";
import Test from "../models/Test.js";
import mongoose from "mongoose";

// Helper to validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET ALL REPORTS OF A USER
export const getUserReports = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const reports = await MedicalReport.find({ user: userId })
      .populate("user")
      .populate("diseases")   // FIX: was "disease" (singular) — must match schema field name
      .populate("medicines")
      .populate("tests")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalReports: reports.length,
      reports,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE REPORT
export const getSingleReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!isValidId(reportId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid report ID" });
    }

    const report = await MedicalReport.findById(reportId)
      .populate("user")
      .populate("diseases")
      .populate("medicines")
      .populate("tests");

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE REPORT BY ID
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid report ID" });
    }

    const report = await MedicalReport.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    // Remove this report reference from linked diseases, medicines, tests
    if (report.diseases?.length) {
      await Disease.updateMany(
        { _id: { $in: report.diseases } },
        { $pull: { reports: new mongoose.Types.ObjectId(id) } }
      );
    }

    if (report.medicines?.length) {
      await Medicine.updateMany(
        { _id: { $in: report.medicines } },
        { $pull: { reports: new mongoose.Types.ObjectId(id) } }
      );
    }

    if (report.tests?.length) {
      await Test.updateMany(
        { _id: { $in: report.tests } },
        { $pull: { reports: new mongoose.Types.ObjectId(id) } }
      );
    }

    await MedicalReport.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};