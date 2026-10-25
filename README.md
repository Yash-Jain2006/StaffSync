# StaffSync — Modern Human Resource Management Platform (MERN)

![StaffSync Logo](frontend/public/logo.svg)

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-black?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5-purple?logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-forestgreen?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**StaffSync** is a full-featured, enterprise-grade Human Resource Management (HRM) platform built with the MERN stack (MongoDB, Express, React, Node.js) and styled with a dark navy glassmorphic design system. It streamlines employee records, attendance tracking, leave applications, company announcements, and training management across HR, Managers, and Employees.

---

## 🌟 Key Features

### 🏢 1. Role-Based Portals & Access Control
- **HR Dashboard**: Full CRUD over employee database, department allocation, salary control, leave reviews (Approve/Reject), attendance logs, and company-wide announcements.
- **Manager Dashboard**: Team oversight, leave review workflows, and training session creation with smart employee assignment dropdowns.
- **Employee Portal**: Self-service check-in/out attendance tracking, past attendance records history, leave application tracking, and training notifications.

### 👥 2. Employee Management with Direct IDs
- Interactive table displaying name, email, department, position, join date, phone, and address.
- Interactive **`ID: <ObjectId> 📋`** badge with instant click-to-copy functionality for easy lookup.
- Salary is strictly restricted and visible only to HR administrators.

### ⏱️ 3. Smart Attendance Tracking
- Real-time **Check In** / **Check Out** with automatic duration calculation.
- Dynamic status calculation (`Present`, `Half-day` for < 4 hours, and `Absent`).
- Comprehensive attendance history with chronological dates, timestamps, and status badges.

### 🌴 4. Leave Management & Approval Flow
- Multi-tier routing: Employees apply with date ranges and reasons; HR and Managers review and approve/reject with live status feedback.
- Safeguards to prevent conflicts or redundant status transitions.

### 📚 5. Training & Development
- Create and manage company training sessions with date pickers and trainer assignments.
- Built-in employee assignment dropdown displaying employee names with their IDs.
- Safeguards against invalid object IDs or demo item updates.

### 🎨 6. Premium UI & Vector Branding
- Custom SVG vector logo emblem with dual-orbit synchronization and vibrant blue-to-cyan gradient.
- Intuitive navigation with **`← Back to Home`** buttons on authentication pages.
- Fast, responsive, dark-mode design optimized for desktop and mobile viewports.

---

## 🏗️ Architecture

```
staffsync/
├── backend/                  # Express.js REST API
│   ├── config/              # Database connection (MongoDB Atlas/Local)
│   ├── controllers/         # Business logic for auth, employees, attendance, leaves, trainings
│   ├── middleware/          # JWT auth guard, role-based authorization, error handler, helpers
│   ├── models/              # Mongoose data schemas (User, Employee, Attendance, Leave, Training, Announcement)
│   ├── routes/              # Express API route declarations
│   └── tests/               # Unit and Integration test suites
│       ├── unit/            # Utility & Auth middleware tests
│       └── integration/     # Full REST API integration tests
│
└── frontend/                 # React 18 + Vite Web Application
    ├── public/              # Static assets, logo.svg, and favicons
    ├── src/
    │   ├── api/             # Axios client with JWT request/response interceptors
    │   ├── components/      # UI components (HR, Manager, Employee, Auth, Navbar, Logo)
    │   ├── pages/           # Portal dashboards (HrDashboard, ManagerDashboard, EmployeeDashboard)
    │   ├── utils/           # AuthContext, formatting helpers, custom hooks
    │   └── App.css          # Core design system and theme styles
    └── tests/               # Frontend Unit & End-to-End (E2E) test suites
        ├── unit/            # Date and currency formatting unit tests
        └── e2e/             # Automated user journey tests
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Cloud URI)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Yash-Jain2006/StaffSync.git
cd StaffSync
```

---

### 2. Backend Setup
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend/` directory (see `backend/.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/staffsync?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:5173
   SEED_HR_EMAIL=admin@staffsync.com
   SEED_HR_PASSWORD=Password123!
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will start on `http://localhost:5000`.*

---

### 3. Frontend Setup
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be live at `http://localhost:5173`.*

---

## 🧪 Testing Suite

StaffSync includes a comprehensive test suite covering Unit, API Integration, and Full-Stack E2E workflows using Node's native test runner (`node:test`):

### Run Backend Tests (Unit & Integration)
```bash
cd backend
npm test                 # Runs all 30 backend tests
npm run test:unit        # Runs only unit tests
npm run test:integration # Runs only API integration tests
```

### Run Frontend Tests (Unit & E2E)
```bash
cd frontend
npm test                 # Runs all 17 frontend tests
npm run test:unit        # Runs formatting utility unit tests
npm run test:e2e         # Runs full-stack E2E tests
```

---

## 🔑 Default Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **HR Administrator** | `admin@staffsync.com` | `Password123!` |
| **Manager** | `manager@staffsync.com` | `Password123!` |
| **Employee** | `employee@staffsync.com` | `Password123!` |

*(You can also register a new account anytime on the `/register` page with your preferred role).*

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new user with specific role |
| `/api/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| `/api/auth/me` | `GET` | Authenticated | Retrieve current user profile |
| `/api/employees` | `GET` | HR, Manager | Retrieve active employees |
| `/api/employees` | `POST` | HR | Create new employee profile |
| `/api/employees/:id` | `PATCH` | HR | Update employee details |
| `/api/employees/:id` | `DELETE`| HR | Soft-delete / deactivate employee |
| `/api/attendance/check-in` | `POST` | Employee | Record today's check-in |
| `/api/attendance/check-out` | `POST` | Employee | Record check-out & calculate status |
| `/api/attendance/mine` | `GET` | Employee | Fetch personal attendance history |
| `/api/attendance` | `GET` | HR, Manager | Company-wide attendance records |
| `/api/leaves` | `POST` | Authenticated | Submit leave application |
| `/api/leaves` | `GET` | HR, Manager | View pending leave requests |
| `/api/leaves/:id/decision` | `PATCH`| HR, Manager | Approve or reject a leave request |
| `/api/trainings` | `GET` | Authenticated | List assigned or created trainings |
| `/api/trainings` | `POST` | HR, Manager | Create a new training session |
| `/api/trainings/:id` | `PATCH` | HR, Manager | Update a training session |
| `/api/announcements` | `GET` | Authenticated | List active announcements |
| `/api/announcements` | `POST` | HR | Publish new company announcement |

---

## 🛡️ Security & Best Practices
- Passwords are securely hashed with `bcryptjs`.
- Stateless authentication with signed JSON Web Tokens (JWT).
- Environment secrets (`.env`) are strictly excluded via `.gitignore`.
- Role verification enforced at both routing middleware and controller layers.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
