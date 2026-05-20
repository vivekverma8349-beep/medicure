import express from 'express'

import protect from '../middleware/authMiddleware.js'

import {
  getDashboardSummary,
  getUserProfile
 
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get(
  '/summary',
  protect,
  getDashboardSummary
)

router.get(
  '/profile',
  protect,
  getUserProfile
)




export default router