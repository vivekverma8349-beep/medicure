# MediTrack - Health Dashboard Frontend

A beautiful, production-ready React frontend for the MediTrack health platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

Open http://localhost:5173 in your browser.

## 🔧 Backend Connection

The frontend connects to your backend at `http://localhost:5000/api`.
Make sure your backend is running before using authenticated features.

To change the backend URL, edit `src/api/axios.js`:
```js
const API = axios.create({
  baseURL: 'http://localhost:5000/api' // Change this
})
```

## 📁 Project Structure

```
src/
├── api/           # Axios config + interceptors
├── components/    # Reusable UI components
├── context/       # React Context (Auth)
├── layouts/       # Page layouts
├── pages/         # All page components
├── routes/        # Protected route wrapper
└── services/      # API service functions
```

## 📦 Pages

| Route | Page |
|-------|------|
| `/` | Dashboard (Home) |
| `/login` | Login |
| `/register` | Register |
| `/reports` | Medical Reports + AI Analysis |
| `/chat` | AI Health Chatbot |
| `/medicines` | Medicine Tracker |
| `/conditions` | Active Conditions |
| `/tests` | Medical Tests |
| `/profile` | User Profile |
| `/bmi` | BMI Calculator |
| `/hospitals` | Hospitals |
| `/settings` | Settings |

## 🔑 Authentication

- JWT token stored in `localStorage` as `userInfo`
- All protected routes redirect to `/login` if not authenticated
- Token auto-attached to all API requests via Axios interceptor

## 🎨 Tech Stack

- **React 18** + Vite
- **Tailwind CSS** for utility styles
- **React Router v6** for navigation
- **Axios** for API calls
- **Google Fonts**: Sora (display) + DM Sans (body)
