// routes/testRoutes.js

import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllTests,
  getSingleTest,
  getTestReports,
  deleteTest,
} from "../controllers/testController.js";

const router = express.Router();

// ROUTES
router.get("/", protect, getAllTests);
router.get("/:id", protect, getSingleTest);
router.get("/:id/reports", protect, getTestReports);

// NEW FEATURE: DELETE TEST
router.delete("/:id", protect, deleteTest);

export default router;
