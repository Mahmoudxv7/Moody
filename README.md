# 🌿 Moody — Mood Tracking Web Application

A full-stack web application that allows users to monitor their daily emotional status, write reflections, and connect with therapists for professional support.

---

## 👥 Team Members

| Name | Student ID |
|------|-----------|
| Mahmoud Ayman Abuzaanounah | 2221191196 |
| Abdelrahman Sharif | 2221192007 |

---

## 📋 Project Overview

Moody is a mood tracking platform where users can:
- Log their daily mood using emoji-based selectors
- Write optional reflections about their day
- View mood trends and monthly reports
- Connect with a professional therapist
- Therapists can monitor assigned users and write clinical notes

---

## 🛠️ Technology Stack

### Frontend
- **React** (Vite)
- **React Router DOM** — client-side navigation
- **Axios** — HTTP client for API calls
- **CSS** — custom global stylesheet

### Backend
- **Node.js** with **Express.js**
- **MongoDB Atlas** — cloud database
- **Mongoose** — ODM for MongoDB
- **JWT** — JSON Web Token authentication
- **bcryptjs** — password hashing
- **dotenv** — environment variables
- **cors** — cross-origin resource sharing
- **nodemon** — development server

---

## 📁 Project Structure

```
Moody Web/
├── README.md
├── Frontend/                        # React frontend application
│   ├── src/
│   │   ├── pages/                   # All page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ChooseTherapist.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── MonthlyReport.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── TherapistDashboard.jsx
│   │   │   ├── TherapistPatients.jsx
│   │   │   ├── TherapistPatientView.jsx
│   │   │   └── TherapistNotes.jsx
│   │   ├── services/                # API service files
│   │   │   ├── api.js               # Base axios instance
│   │   │   ├── authService.js       # Login, register, logout
│   │   │   ├── moodService.js       # Mood entries CRUD
│   │   │   ├── therapistService.js  # Therapist assignments
│   │   │   ├── noteService.js       # Clinical notes CRUD
│   │   │   ├── quoteService.js      # Motivation quotes
│   │   │   └── userService.js       # User profile
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── App.css                  # Global stylesheet
│   │   └── main.jsx                 # Entry point
│   └── package.json
│
└── Backend/                         # Node.js backend application
    ├── config/
    │   └── db.js                    # MongoDB connection
    ├── controllers/
    │   ├── authController.js        # Register, Login, GetMe
    │   ├── userController.js        # User CRUD
    │   ├── moodController.js        # Mood entries CRUD + report
    │   ├── noteController.js        # Therapist notes CRUD
    │   ├── therapistController.js   # Therapist assignments
    │   └── quoteController.js       # Motivation quotes
    ├── middleware/
    │   └── authMiddleware.js        # JWT authentication
    ├── models/
    │   ├── Role.js
    │   ├── User.js
    │   ├── MoodEntry.js
    │   ├── TherapistAssignment.js
    │   ├── TherapistNote.js
    │   ├── MotivationQuote.js
    │   └── LogTable.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── moodRoutes.js
    │   ├── noteRoutes.js
    │   ├── therapistRoutes.js
    │   └── quoteRoutes.js
    ├── seeder.js                    # Database seeder with mock data
    ├── server.js                    # Express server entry point
    ├── .env                         # Environment variables (not in repo)
    ├── .gitignore
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account

---

### 🔧 Backend Setup

**1 — Navigate to Backend folder:**
```bash
cd Backend
```

**2 — Install dependencies:**
```bash
npm install
```

**3 — Create `.env` file in the Backend folder:**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/moody?retryWrites=true&w=majority
JWT_SECRET=moody_super_secret_key_2024
JWT_EXPIRE=7d
```
> Replace `<username>` and `<password>` with your MongoDB Atlas credentials

**4 — Important: If you face MongoDB DNS connection issues**, update `config/db.js` to use Google DNS:
```javascript
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
```
This is already included in the `config/db.js` file.

**5 — Seed the database with mock data:**
```bash
npm run seed
```

**6 — Start the development server:**
```bash
npm run dev
```

The backend server will run on: `http://localhost:5000`

---

### 🎨 Frontend Setup

**1 — Navigate to Frontend folder:**
```bash
cd Frontend
```

**2 — Install dependencies:**
```bash
npm install
```

**3 — Start the development server:**
```bash
npm run dev
```

The frontend will run on: `http://localhost:5173`

---

### ▶️ Running Both Servers

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd Frontend
npm run dev
```

Then open your browser at: `http://localhost:5173`

---

## 🔑 Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| User | sarah@gmail.com | Sarah123 |
| User | omar@gmail.com | Omar123 |
| Therapist | lina@moody.com | Lina123 |
| Therapist | ahmad@moody.com | Ahmad123 |

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Private |
| GET | /api/users | Get all users | Private |
| PUT | /api/users/:id | Update user | Private |
| DELETE | /api/users/:id | Delete user | Private |
| POST | /api/moods | Create mood entry | Private |
| GET | /api/moods | Get all mood entries | Private |
| GET | /api/moods/report | Get monthly report | Private |
| PUT | /api/moods/:id | Update mood entry | Private |
| DELETE | /api/moods/:id | Delete mood entry | Private |
| GET | /api/therapists | Get all therapists | Private |
| POST | /api/therapists/assign | Assign therapist | Private |
| GET | /api/therapists/patients | Get assigned patients | Private |
| POST | /api/notes | Create clinical note | Private |
| GET | /api/notes | Get all notes | Private |
| PUT | /api/notes/:id | Update note | Private |
| DELETE | /api/notes/:id | Delete note | Private |
| GET | /api/quotes | Get all quotes | Public |
| GET | /api/quotes/random | Get random quote | Public |

---

## 🔒 Authentication

The API uses **JWT (JSON Web Token)** authentication.

Include the token in all protected requests:
```
Authorization: Bearer <your_token>
```

The token is returned when you register or login.

---

## 🗄️ Database Collections

| Collection | Description |
|------------|-------------|
| roles | User roles (User, Therapist) |
| users | All platform users |
| moodentries | Daily mood logs |
| therapistassignments | User-therapist links |
| therapistnotes | Private clinical notes |
| motivationquotes | Inspirational quotes |
| logtables | System activity logs |

---

## 📝 Available Scripts

### Backend
```bash
npm run dev    # Start development server with nodemon
npm run start  # Start production server
npm run seed   # Seed database with mock data
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
```

---

## ⚠️ Troubleshooting

**MongoDB Connection Error (ECONNREFUSED or ETIMEOUT):**
This is usually a DNS issue on restricted networks. The fix is already implemented in `config/db.js` using Google DNS servers (8.8.8.8).

**Port already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Frontend not connecting to Backend:**
Make sure the backend is running on port 5000 before starting the frontend.

---

© 2026 Moody. Designed for your digital cocoon.
