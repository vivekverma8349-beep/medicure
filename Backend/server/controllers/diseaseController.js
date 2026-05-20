import Disease from "../models/Disease.js";
import MedicalReport from "../models/Report.js";
import mongoose from "mongoose";

// NEW FEATURE: Helper to validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET ALL DISEASES
export const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, diseases });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW FEATURE: DELETE DISEASE BY ID
export const deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid disease ID" });
    }

    // Find disease belonging to current user
    const disease = await Disease.findOne({ _id: id, user: req.user._id });

    if (!disease) {
      return res
        .status(404)
        .json({ success: false, message: "Disease not found" });
    }

    // Remove this disease reference from all linked reports
    await MedicalReport.updateMany(
      { diseases: id },
      { $pull: { diseases: new mongoose.Types.ObjectId(id) } }
    );

    // Delete the disease document
    await Disease.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Disease deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
