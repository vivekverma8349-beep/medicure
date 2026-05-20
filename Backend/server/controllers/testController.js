// controllers/testController.js

import Test from "../models/Test.js";
import MedicalReport from "../models/Report.js";
import mongoose from "mongoose";

// NEW FEATURE: Helper to validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET ALL TESTS
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ user: req.user._id })
      .populate({
        path: 'reports',
        populate: [
          { path: 'diseases' },
          { path: 'medicines' },
          { path: 'tests' },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tests.length, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE TEST
export const getSingleTest = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid test ID" });
    }

    const test = await Test.findById(req.params.id).populate({
      path: "reports",
      populate: { path: "user" },
    });

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    res.status(200).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL REPORTS OF TEST
export const getTestReports = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid test ID" });
    }

    const test = await Test.findById(req.params.id).populate({
      path: "reports",
      populate: [
        { path: "user" },
        { path: "diseases" },
        { path: "medicines" },
      ],
    });

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    res.status(200).json({
      success: true,
      testName: test.name,
      totalReports: test.reports.length,
      reports: test.reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW FEATURE: DELETE TEST BY ID
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid test ID" });
    }

    const test = await Test.findOne({ _id: id, user: req.user._id });

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Remove test reference from all linked reports
    await MedicalReport.updateMany(
      { tests: id },
      { $pull: { tests: new mongoose.Types.ObjectId(id) } }
    );

    await Test.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
