import express from 'express'
import multer from 'multer'
import analyzeMedicalReport from '../controllers/reportAnalysisController.js'
import protect from '../middleware/authMiddleware.js'
const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.post(
  '/analyze-report',
  protect,
  upload.single('report'),
  analyzeMedicalReport
)
export default router