import dotenv from 'dotenv'

import { GoogleGenerativeAI } from '@google/generative-ai'

// Load .env variables
dotenv.config()

// Create Gemini instance
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

// Select Gemini model
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
})

// Export model
export default model