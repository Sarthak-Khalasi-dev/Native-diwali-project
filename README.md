# SplitFlow - Smart Expense & Group Bill Splitter 💸

A modern, full-stack financial management mobile application built with **React Native (Expo)**, **Node.js/Express**, and **MongoDB**. SplitFlow makes tracking personal expenses, managing monthly budgets, and splitting shared group bills effortless and transparent.

---

## 📱 App Links & Repository

- **GitHub Repository:** [https://github.com/Sarthak-Khalasi-dev/Native-diwali-project.git](https://github.com/Sarthak-Khalasi-dev/Native-diwali-project.git)
- **Expo App Link / Slug:** `exp://u.expo.dev/projects/splitflow` (Slug: `splitflow`)
- **Package Identifier:** `com.sarthak.splitflow`

---

## ✨ Key Features

### 1. 📊 Personal Expense & Income Tracking
- **Transaction Logging**: Record expenses and income with amount, title, date, notes, and payment methods (UPI/QR, Cash, Card, Net Banking).
- **Category Organization**: Categorize transactions (Food & Dining, Groceries, Housing & Rent, Bills & Utilities, Entertainment, Salary, etc.).
- **Interactive Filtering**: Filter transactions seamlessly across categories with one-tap pill filters.
- **Full CRUD Support**: Add, edit, or delete transactions on the fly with instant balance updates.

### 2. 👥 Group Bill Splitting & Debt Settlement Engine
- **Shared Groups**: Create groups for flatmates, trips, couples, office teams, or events.
- **Multi-Member Email Invites**: Add friends and group members using their email addresses.
- **Automated Equal & Custom Split**: Split bills automatically with instant per-person calculation.
- **Net Balance Breakdown**: Real-time balance ledger indicating exactly who owes whom (`+₹X gets back` vs `-₹X owes`).
- **One-Tap "Settle Up"**: Record settlements directly via UPI, Cash, or Net Banking to clear balances.

### 3. 📈 Financial Analytics & Visual Insights
- **Monthly Spending Trends**: Live visual comparison between total income and expenses.
- **Category Breakdown Bars**: Color-coded progress indicators illustrating spending distribution percentages.
- **Budget Burn Rate & Warnings**: Real-time monitoring of monthly budget utilization with warning alerts.
- **Financial Statement Export**: Generate and share summary reports with a single tap.

### 4. 🔒 Authentication & Profile Preferences
- **Secure Authentication**: JWT token-based auth with encrypted password hashing (`bcryptjs`).
- **Persistent Sessions**: Seamless session persistence across app launches via local storage.
- **Customizable Preferences**: Update monthly target budget and choose preferred currency (`₹ INR`, `$ USD`, `€ EUR`, `£ GBP`).
- **1-Tap Quick Fill Demo Account**: Test all features instantly without signing up from scratch.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Mobile App)
- **Framework:** React Native with **Expo SDK 52**
- **Navigation:** React Navigation 7 (Bottom Tabs + Native Stack)
- **Design System:** Custom Dark Theme design tokens (Navy / Indigo / Slate)
- **Icons & Assets:** `@expo/vector-icons` (Ionicons), `expo-font`, `expo-asset`
- **State & Storage:** Context API (`AuthContext`), `@react-native-async-storage/async-storage`

### Backend (REST API)
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **CORS & Environment:** `cors`, `dotenv`

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally on default port `27017` (or MongoDB Atlas URI in `.env`)
- **Expo Go** mobile app (iOS or Android) or an emulator

---

### 2. Backend Setup & Seeding

```bash
cd backend
npm install
npm run seed     # Seeds demo users, expenses, and roommate group
npm run dev      # Starts server on http://localhost:5000
```

---

### 3. Frontend Mobile Setup

```bash
cd frontend
npm install
npx expo start
```

- **Run on Web:** Press `w` in your terminal to open in browser.
- **Run on Android Emulator:** Press `a`.
- **Run on iOS Simulator:** Press `i`.
- **Run on Physical Phone:** Scan the QR code using the **Expo Go** app on your phone.
  > *Note: When running on a physical phone, ensure your phone and computer are on the same Wi-Fi network and update `BASE_URL` in `frontend/src/services/api.jsx` to your computer's local IP (e.g. `http://192.168.1.X:5000/api`).*

---

## 🔑 Demo Credentials

To test the application immediately:
- **Email:** `sarthak@splitflow.com`
- **Password:** `password123`
*(Or simply tap **"Quick Fill Demo Credentials"** on the Login screen).*

---

## 👨‍💻 Author & Submission

- **Author:** Sarthak Khalasi
- **Project:** Diwali Project Submission
- **Target Date:** 21st - 22nd November 2026
