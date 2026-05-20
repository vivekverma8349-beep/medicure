# MediCure - Quick Start Guide

## 🚀 Start Development Servers (2 Terminals)

### Terminal 1 - Backend
```bash
cd c:\Users\vkhus\OneDrive\Desktop\medicure\server
npm run dev
```
✅ Backend runs on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd c:\Users\vkhus\OneDrive\Desktop\medicure\client
npm run dev
```
✅ Frontend runs on: http://localhost:5173

## 📍 Access the Application

Open your browser: **http://localhost:5173**

## 📂 File Structure

```
medicure/
│
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # 7 Components (Navbar, Sidebar, etc.)
│   │   ├── context/           # 2 Context files (Auth, Chat)
│   │   ├── pages/             # 9 Pages
│   │   ├── App.jsx            # Main routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                    # Express Backend
│   ├── models/                # 3 MongoDB Models
│   │   ├── User.js
│   │   ├── Report.js
│   │   └── ChatSession.js
│   ├── routes/                # 3 API Routes
│   │   ├── auth.js
│   │   ├── reports.js
│   │   └── chat.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── README.md                  # Full documentation
├── SETUP.md                   # Detailed setup guide
└── QUICKSTART.md              # This file
```

## 🌟 Key Features Included

✅ **Responsive Navbar** - Fixed top navigation with logo and buttons
✅ **Toggle Sidebar** - Collapsible left menu with 8 options
✅ **9 Pages** - Home, About, Services, Contact, Chatbot, Reports, etc.
✅ **AI Chatbot** - Functional chat interface with message history
✅ **Medical Report Upload** - File upload interface with preview
✅ **Blood Report Analysis** - Interactive progress bars
✅ **Dark Theme** - Professional cyan and dark blue colors
✅ **Animations** - Framer Motion animations on home page
✅ **API Ready** - All backend routes configured
✅ **Tailwind CSS** - Complete responsive design

## 🔗 Important Links

### Frontend Routes
- Home: `/`
- About: `/about`
- Services: `/services`
- Contact: `/contact`
- Chatbot: `/chatbot`
- Medical Report: `/medical-report`
- Medicine Details: `/medicine-details`
- Disease Details: `/disease-details`
- Blood Report: `/blood-report`

### Backend API
- Base URL: `http://localhost:5000`
- Chat: `POST /api/chat`
- Reports: `GET /api/reports`, `POST /api/reports`
- Auth: `POST /auth/register`, `POST /auth/login`

## 📋 To Do Next

1. **Connect MongoDB** - Update `.env` with MongoDB URI
2. **Integrate APIs** - Add OpenAI/Gemini API keys
3. **Implement Auth** - Add JWT authentication
4. **Connect Backend** - Use Axios in components to call API
5. **Deploy** - Build and deploy to Vercel/Railway

## 🎨 Styling

- **Theme Color:** Cyan (#06b6d4)
- **Dark BG:** #0A1628
- **Cards:** #112240
- **Font:** Tailwind defaults (Segoe UI)

## ⚡ Commands Reference

```bash
# Backend
npm run dev          # Start with nodemon
npm start            # Production start

# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build

# Both
npm install          # Install dependencies
npm audit fix        # Fix vulnerabilities
```

## 🔐 Environment Setup

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

## ✨ Ready to Code!

Your MediCure project is fully set up and ready for development. All components, pages, and backend routes are ready to be enhanced with API integration and real functionality.

**Happy Coding! 🎉**

---
*Created: May 10, 2026*
