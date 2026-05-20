# MediCure Setup Guide

Complete setup instructions for the MediCure MERN project.

## 📁 Project Location
```
c:\Users\vkhus\OneDrive\Desktop\medicure\
```

## ✅ Completed Setup

### Backend (Express.js)
- ✅ Express server configured
- ✅ CORS enabled
- ✅ MongoDB models (User, Report, ChatSession)
- ✅ API routes (auth, reports, chat)
- ✅ Environment variables setup
- ✅ Dependencies installed

**Backend Folder:** `server/`
**Dependencies installed:** 119 packages

### Frontend (React + Vite)
- ✅ React 18 with Vite
- ✅ React Router DOM for navigation
- ✅ Tailwind CSS for styling
- ✅ Framer Motion for animations
- ✅ Lucide React for icons
- ✅ All components created
- ✅ All pages created
- ✅ Dependencies installed

**Frontend Folder:** `client/`
**Dependencies installed:** 158 packages

## 🚀 Running the Project

### 1. Backend Development Server

Open a terminal and run:
```bash
cd c:\Users\vkhus\OneDrive\Desktop\medicure\server
npm run dev
```

**Expected Output:**
```
Server running on 5000
```

The backend will run on: `http://localhost:5000`

### 2. Frontend Development Server

Open a new terminal and run:
```bash
cd c:\Users\vkhus\OneDrive\Desktop\medicure\client
npm run dev
```

**Expected Output:**
```
  VITE v4.2.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

Visit: `http://localhost:5173`

## 🛠️ Available Scripts

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Scripts
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
```

## 📋 Frontend Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with features |
| `/about` | About | About MediCure |
| `/services` | Services | Available services |
| `/contact` | Contact | Contact form and info |
| `/chatbot` | ChatbotPage | AI chatbot interface |
| `/medical-report` | MedicalReport | Medical report upload |
| `/medicine-details` | MedicineDetails | Medicine database |
| `/disease-details` | DiseaseDetails | Disease information |
| `/blood-report` | BloodReport | Blood report analysis |

## 🧩 Frontend Components

| Component | Purpose |
|-----------|---------|
| `Navbar` | Top navigation bar |
| `Sidebar` | Left sidebar menu |
| `Footer` | Footer component |
| `FeatureCard` | Feature display card |
| `StatCard` | Statistics card |
| `TestimonialCard` | Testimonial display |
| `ChatBot` | Chat interface |

## 🔌 Backend API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "message": "Explain my CBC report"
}

Response:
{
  "reply": "AI Response for: Explain my CBC report"
}
```

### Auth Routes
```
POST /auth/register
POST /auth/login
```

### Report Routes
```
GET /api/reports
POST /api/reports
```

## 🗄️ Backend Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Report Model
```javascript
{
  userId: ObjectId,
  reportName: String,
  reportUrl: String,
  aiSummary: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### ChatSession Model
```javascript
{
  userId: ObjectId,
  messages: Array,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 📝 Environment Setup

### Backend (.env)
Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medicure
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend
No `.env` file needed for basic setup. Create `.env.local` if needed:

```env
VITE_API_URL=http://localhost:5000
```

## 📦 Project Dependencies

### Frontend (client/package.json)
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.10.0
- axios: ^1.3.0
- framer-motion: ^10.0.0
- lucide-react: ^0.263.0
- react-icons: ^4.8.0
- zustand: ^4.3.0
- tailwindcss: ^3.3.0
- vite: ^4.2.0

### Backend (server/package.json)
- express: ^5.0.0
- cors: ^2.8.5
- dotenv: ^16.0.3
- mongoose: ^7.0.0
- nodemon: ^2.0.20

## 🔧 Configuration Files

### Frontend
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `index.html` - HTML entry point

### Backend
- `server.js` - Express server entry point
- `.env.example` - Example environment variables

## 🎨 Styling

The project uses **Tailwind CSS** with a custom dark theme:
- Primary background: `#0A1628`
- Secondary background: `#0D1F3C`
- Card background: `#112240`
- Accent color: Cyan (`#06b6d4`)

## 🚀 Next Steps

1. **MongoDB Setup**
   - Create MongoDB Atlas account
   - Get connection string
   - Update `.env` file

2. **API Integration**
   - Integrate OpenAI API for chatbot
   - Connect Gemini API for analysis
   - Set up file upload service

3. **Authentication**
   - Implement JWT authentication
   - Add login/register functionality
   - Protected routes

4. **Database Connection**
   - Connect frontend to backend
   - Setup API calls with Axios
   - Error handling

5. **Deployment**
   - Build frontend: `npm run build`
   - Deploy to Vercel/Netlify (frontend)
   - Deploy to Render/Railway (backend)
   - Deploy to MongoDB Atlas (database)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# If port 5000 is in use, change in server.js or .env
# For port 5173 (frontend), Vite will use next available
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### MongoDB Connection Error
```bash
# Verify connection string in .env
# Check MongoDB Atlas whitelist IP
```

## 📞 Support

For help, refer to:
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Project Created:** May 10, 2026
**Status:** Ready for Development
