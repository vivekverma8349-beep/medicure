import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { getAllDiseases, deleteDisease } from '../controllers/diseaseController.js'

const router = express.Router()

// GET ALL DISEASES
router.get('/', protect, getAllDiseases)

// NEW FEATURE: DELETE DISEASE
router.delete('/:id', protect, deleteDisease)

export default router
