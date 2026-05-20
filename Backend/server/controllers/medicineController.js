// controllers/medicineController.js

import Medicine from "../models/Medicine.js";
import MedicalReport from "../models/Report.js";
import mongoose from "mongoose";

// NEW FEATURE: Helper to validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET ALL MEDICINES
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user._id })
      .populate({
        path: 'reports',
        populate: [
          { path: 'diseases' },
          { path: 'medicines' },
          { path: 'tests' },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: medicines.length, medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE MEDICINE
export const getSingleMedicine = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid medicine ID" });
    }

    const medicine = await Medicine.findById(req.params.id).populate({
      path: "reports",
      populate: { path: "user" },
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    res.status(200).json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL REPORTS OF MEDICINE
export const getMedicineReports = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid medicine ID" });
    }

    const medicine = await Medicine.findById(req.params.id).populate({
      path: "reports",
      populate: [{ path: "user" }, { path: "diseases" }, { path: "tests" }],
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    res.status(200).json({
      success: true,
      medicineName: medicine.name,
      totalReports: medicine.reports.length,
      reports: medicine.reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW FEATURE: DELETE MEDICINE BY ID
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid medicine ID" });
    }

    const medicine = await Medicine.findOne({ _id: id, user: req.user._id });

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    // Remove medicine reference from all linked reports
    await MedicalReport.updateMany(
      { medicines: id },
      { $pull: { medicines: new mongoose.Types.ObjectId(id) } }
    );

    await Medicine.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Medicine deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
