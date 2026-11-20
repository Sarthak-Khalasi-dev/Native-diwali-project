# SplitFlow - Smart Expense & Group Bill Splitter 💸

> **Diwali Project Submission**  
> **Author:** Sarthak Khalasi  
> **Target Final Submission:** 22nd November 2026  
> **Tech Stack:** React Native (Expo) • Node.js • Express • MongoDB Mongoose

---

## 📅 Development Roadmap & Milestones

- [x] **Day 1: Project Architecture & Backend Scaffolding**
  - Configured project directory structure (`backend` and `frontend`).
  - Set up MongoDB Mongoose schemas (`User`, `Expense`, `Group`, `GroupExpense`, `Settlement`).
  - Implemented initial REST API controllers & routes (Auth, Expenses, Groups, Analytics).
  - Created database seeder script (`backend/src/seed.js`) with demo accounts and sample expenses.
  - Initialized React Native Expo project structure and dark modern design token theme.

- [x] **Day 2: Authentication System & UI Foundation**
  - **Auth State Management (`AuthContext.js`)**:
    - Centralized auth state (`user`, `token`, `isAuthenticated`, `isLoading`, `authError`).
    - Async storage persistence (`splitflow_token` & `splitflow_user`) for persistent session across app reboots.
    - Token verification against backend `/api/auth/me`.
    - Profile update & seamless session logout handlers.
  - **Design System & Reusable Components (`frontend/src/components/common/`)**:
    - `Button.js`: Variants (`primary`, `secondary`, `outline`, `danger`, `ghost`), loading states, sizing (`sm`, `md`, `lg`).
    - `Input.js`: Styled text input with floating label, password eye toggle (`Show/Hide`), validation indicators, helper messages.
    - `Card.js`: Themed containers (`default`, `elevated`, `flat`) matching Slate/Navy design tokens.
    - `Badge.js`: Colorful status & milestone pills with subtle background glows.
    - `Header.js`: Screen top bars with back navigation and title/action layouts.
    - `StatCard.js`: Visual financial metric cards with formatted currency and trend indicators.
  - **Screen Implementations**:
    - `LoginScreen.js`: User authentication form, input validation, 1-tap **Quick Fill Demo Credentials** (`sarthak@splitflow.com` / `password123`), error banner.
    - `RegisterScreen.js`: User registration, email format & password length validation, interactive currency selector (`₹`, `$`, `€`, `£`), monthly budget configuration.
    - `DashboardScreen.js`: Live budget utilization bar, monthly income/expense summary, cashflow balance, recent transactions list with refresh control, backend connectivity status indicator.
  - **API Client Layer (`frontend/src/services/api.js`)**:
    - Automatic JWT `Bearer` token header injection.
    - Modular endpoints (`api.auth`, `api.expenses`, `api.groups`, `api.analytics`).

- [x] **Day 3: React Navigation & Deep Route Integration (17 Nov)**
  - Bottom Tab Navigator (`Dashboard`, `Expenses`, `Groups`, `Analytics`, `Profile`).
  - Native stack transitions and sub-routes for group breakdown & management.

- [x] **Day 4: Personal Expense Tracking & Budget Controls (18 Nov)**
  - Full Expense CRUD modal (`ExpenseModal.jsx`) supporting amount, category, payment method, and notes.
  - Interactive category filter pills with instant updates.
  - Edit and delete transaction actions wired directly to `/api/expenses`.

- [x] **Day 5: Group Bill Splitting & Balance Settlement Algorithm (19 Nov)**
  - Group creation with multi-member email invitation (`CreateGroupModal.jsx`).
  - Equal and split calculation modal (`AddGroupExpenseModal.jsx`).
  - Net balance breakdown with member-by-member debt resolution.
  - Settlement recording modal (`SettleModal.jsx`) connected to `/api/groups/:id/settle`.

- [x] **Day 6: Advanced Financial Analytics & Visual Charts (20 Nov - Today)**
  - Real-time monthly spending trends, category breakdown percentage bars.
  - Financial health cards (Net savings, budget burn rate).
  - One-tap financial statement export & share summary.

- [ ] **Day 7: Final Polish, Offline Sync & Demo Packaging (21-22 Nov)**
  - Polished animations, comprehensive test pass, documentation, and submission APK/Expo build.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally on default port `27017` (or MongoDB Atlas URI)
- **Expo Go** mobile app (iOS or Android) or an emulator

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds demo users, sample expenses, and a roommate group
npm run dev      # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npx expo start
```
- Press `w` to open in your web browser.
- Scan the QR code using the **Expo Go** app on your physical mobile device.
  *(Note: When running on a physical phone, ensure your computer and phone are on the same Wi-Fi and set `BASE_URL` in `frontend/src/services/api.js` to your computer's local IP address, e.g., `http://192.168.1.X:5000/api`).*

---

## 🔑 Demo Credentials
You can log in instantly with the seeded account or tap **"Quick Fill Demo Credentials"** on the Login screen:
- **Email:** `sarthak@splitflow.com`
- **Password:** `password123`
