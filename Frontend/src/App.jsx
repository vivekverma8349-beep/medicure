import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MedicalReport from './pages/MedicalReport'
import ChatbotPage from './pages/ChatbotPage'
import MedicineDetails from './pages/MedicineDetails'
import ActiveConditions from './pages/ActiveConditions'
import Test from './pages/Test'
import Profile from './pages/Profile'
import BMI from './pages/BMI'
import Hospitals from './pages/Hospitals'
import Settings from './pages/Settings'
import { About, Services, Contact } from './pages/StaticPages'

import ProtectedRoute from './routes/ProtectedRoute'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/reports' element={<ProtectedRoute><MedicalReport /></ProtectedRoute>} />
        <Route path='/report' element={<ProtectedRoute><MedicalReport /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        <Route path='/medicines' element={<ProtectedRoute><MedicineDetails /></ProtectedRoute>} />
        <Route path='/conditions' element={<ProtectedRoute><ActiveConditions /></ProtectedRoute>} />
        <Route path='/tests' element={<ProtectedRoute><Test /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/bmi' element={<ProtectedRoute><BMI /></ProtectedRoute>} />
        <Route path='/hospitals' element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path='/about' element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path='/services' element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path='/contact' element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
