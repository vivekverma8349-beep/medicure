// routes/medicalChatRoutes.js

import express from "express";

import { medicalChat } from "../controllers/medicalChatController.js";

const router = express.Router();


// MEDICAL CHAT ROUTE


router.post("/", medicalChat);

export default router;