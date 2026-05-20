import 'dotenv/config'

import express from 'express'
import cors from 'cors'


import analysis from './routes/analysis.js'
import authRoutes from './routes/auth.js'
import diseaseRoutes from './routes/diseaseRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import testRoutes from './routes/test.routes.js'
import reportRoutes from './routes/reportRoutes.js'
import medicineRoutes from './routes/medicineRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'


const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/analysis', analysis)
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/medicines', medicineRoutes)
app.use('/api/tests', testRoutes)
app.use('/api/diseases', diseaseRoutes)

app.get('/', (req, res) => {
  res.send('MediCure API Running')
})

export default app