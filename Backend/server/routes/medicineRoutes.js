// routes/medicineRoutes.js

import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllMedicines,
  getSingleMedicine,
  getMedicineReports,
  deleteMedicine,
} from "../controllers/medicineController.js";

const router = express.Router();

// ROUTES
router.get("/", protect, getAllMedicines);
router.get("/:id", protect, getSingleMedicine);
router.get("/:id/reports", protect, getMedicineReports);

// NEW FEATURE: DELETE MEDICINE
router.delete("/:id", protect, deleteMedicine);

export default router;
