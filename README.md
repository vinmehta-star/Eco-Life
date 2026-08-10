# 🌿 EcoLife — Gamified Sustainability & Carbon Footprint Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-059669.svg?style=for-the-badge)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-12.17.1-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini%20AI-Vision%20%26%20Chat-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![JavaScript](https://img.shields.io/badge/ES6%2B-ES%20Modules-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)

> **EcoLife** is an interactive, gamified web platform that empowers individuals and communities to track their carbon footprint, adopt sustainable habits, classify recyclable waste using AI, earn badges, and grow an interactive visual Impact Tree.

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ System Architecture & Tech Stack](#️-system-architecture--tech-stack)
- [📂 Directory Structure](#-directory-structure)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [🔑 Environment & API Configuration](#-environment--api-configuration)
- [🌐 Cloud Deployment](#-cloud-deployment)
- [📊 Project Report](#-project-report)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features

### 🧮 1. Interactive Carbon Footprint Engine
* **Multi-Domain Assessment**: Real-time evaluation across **Transport, Energy, Food, Waste, and Water**.
* **Equivalency Engine**: Translates raw $kg\text{ CO}_2$ savings into relatable real-world metrics (e.g., trees planted, miles of driving avoided, smartphone charges, LED light hours).
* **Benchmark Comparisons**: Compare personal impact against global and national (e.g. India/World) average baselines.

### 🎮 2. Gamified GreenScore & Progression System
* **Dynamic Scoring Algorithm**: Real-time 0–1000+ GreenScore system with streak multipliers ($1.0\times$ up to $2.0\times$).
* **Level Progression**: Advance through 10 distinct tiers—from *Seedling* to *Eco Legend*.
* **Achievement Badges & Rewards**: Unlock badges for specific milestones (e.g. *Zero Waste Warrior*, *Solar Starter*, *Recycling Master*).
* **Eco-Certificates**: Generate verifiable personal sustainability certificates based on user achievements.

### 🌳 3. Dynamic Interactive Impact Tree
* **HTML5 Canvas Parametric Tree Renderer**: A visual representation of environmental impact that grows dynamically with your GreenScore.
* **Foliage & Growth Animations**: Visual stages ranging from a small seed to a lush, blooming Ancient Tree with animated falling leaves and interactive physics.

### 🤖 4. AI Eco-Buddy & Smart AI Scanner (Powered by Google Gemini)
* **AI Recycling Scanner**: Upload or capture photos of household items to receive instant item identification, bin classification (Recyclable, Trash, Compost, E-Waste), step-by-step disposal instructions, and estimated $CO_2$ impact.
* **EcoBuddy Conversational AI**: Integrated chat assistant providing instant, context-aware advice on sustainable living practices.

### ♻️ 5. Smart Recycling Hub & Database
* **Material Directory**: Comprehensive searchable database with degradation timers, recycling codes (PETE, HDPE, PVC, etc.), and local disposal guidelines.
* **Filter & Search**: Quick filtering by category (Plastics, Glass, Paper, Electronics, Hazardous).

### 👥 6. Community Feed & Global Leaderboard
* **Social Activity Feed**: Share eco-accomplishments, completed missions, and tips with the community.
* **Interactive Leaderboard**: Filter rankings by All-Time, Monthly, or Friends to drive friendly competition.

---

## 🏗️ System Architecture & Tech Stack

EcoLife is built as a lightweight, high-performance Single Page Application (SPA) using vanilla modern web technologies, backed by Firebase serverless architecture and Google Gemini AI.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EcoLife Frontend (SPA)                          │
│                                                                        │
│   ┌────────────────┐   ┌───────────────────┐   ┌───────────────────┐   │
│   │ Router & Views │   │ Stateful Store    │   │ UI Components     │   │
│   │ (Hash Routing) │ ──│ (Local & Cloud)   │ ──│ (Charts, Tree, AI)│   │
│   └────────────────┘   └───────────────────┘   └───────────────────┘   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
┌──────────────┐         ┌───────────────────┐         ┌────────────────┐
│ Firebase Auth│         │ Cloud Firestore   │         │ Google Gemini  │
│ (User Identity)        │ (Realtime Data)   │         │ (AI Inference) │
└──────────────┘         └───────────────────┘         └────────────────┘
```

* **Frontend**: HTML5, Vanilla CSS3 (Custom CSS variables, Glassmorphism design system), Vanilla ES6 Modules (No heavy framework bloat).
* **State Management**: Reactive state pattern with LocalStorage persistence and Firebase Firestore cloud sync.
* **Backend Services**: Firebase Authentication, Cloud Firestore Database, Cloud Functions.
* **AI Engine**: Google Gemini API (`gemini-3.5-flash-lite`) via REST for vision classification and conversational AI.
* **Visualization & Sound**: HTML5 Canvas API, Chart.js for analytics, Web Audio API for custom sound effects.

---

## 📂 Directory Structure

```
Ecolife/
├── index.html               # Main application HTML entry point
├── server.py                # Lightweight Python HTTP dev server
├── firebase.json            # Firebase Hosting & Functions config
├── .firebaserc              # Firebase project target configuration
│
├── css/                     # Styling Modular System
│   ├── index.css            # Global CSS variables & reset rules
│   ├── components.css       # Reusable UI component styles
│   ├── landing.css          # Landing page styles
│   ├── dashboard.css        # User dashboard & overview layout
│   ├── calculator.css       # Carbon calculator view styles
│   ├── recycling.css        # Recycling hub & AI scanner styles
│   ├── missions.css         # Missions & quest board styles
│   ├── community.css        # Social feed & community hub styles
│   └── tree.css             # Impact tree visual container styles
│
├── js/                      # Modular JavaScript Codebase
│   ├── app.js               # Main application initializer
│   ├── router.js            # SPA client-side hash router
│   ├── state.js             # Central reactive state manager
│   ├── config.js            # Global environment configuration
│   ├── firebaseConfig.js    # Firebase SDK initialization
│   │
│   ├── engines/             # Calculation & Logic Engines
│   │   ├── carbonCalc.js    # Carbon calculation formulas & projections
│   │   ├── greenScore.js    # Leveling, streaks, and scoring logic
│   │   ├── ecoBuddy.js      # Chatbot conversation handler
│   │   └── recycling.js     # Recycling lookup engine
│   │
│   ├── services/            # API & External Integrations
│   │   ├── auth.js          # Firebase Authentication service
│   │   ├── firestore.js     # Cloud Firestore real-time database CRUD
│   │   ├── gemini.js        # Google Gemini Vision & Chat API SDK
│   │   ├── sync.js          # Cloud-to-Local state synchronization
│   │   └── sound.js         # Web Audio sound engine
│   │
│   ├── components/          # Reusable UI Components
│   │   ├── navbar.js        # Dynamic top navigation header
│   │   ├── chatbot.js       # EcoBuddy AI chat drawer component
│   │   ├── impactTree.js    # Parametric Canvas Impact Tree visualizer
│   │   ├── leaderboard.js   # Community ranking table
│   │   ├── charts.js        # Chart.js analytics graphs
│   │   ├── missionCard.js   # Individual mission action card
│   │   ├── scoreCard.js     # GreenScore display breakdown
│   │   ├── badge.js         # Achievement badge modal & grid
│   │   ├── certificate.js   # Printable/downloadable eco-certificate
│   │   └── toast.js         # Notification system
│   │
│   ├── views/               # Page Views / Routes
│   │   ├── landing.js       # Welcome landing hero view
│   │   ├── dashboard.js     # Main dashboard view
│   │   ├── calculator.js    # Carbon calculator view
│   │   ├── recycling.js     # AI scanner & recycling database view
│   │   ├── missions.js      # Missions & daily tasks view
│   │   ├── community.js     # Social feed & leaderboard view
│   │   ├── tree.js          # Interactive Tree view
│   │   └── profile.js       # User profile & settings view
│   │
│   └── data/                # Data Models & Reference Records
│       ├── carbonFactors.js # Emission factors (kWh, fuel, food)
│       ├── recyclingDb.js   # Database of materials & disposal rules
│       ├── missions.js      # Pre-configured eco-missions catalog
│       └── badges.js        # Achievement badges definition catalog
│
├── functions/               # Firebase Cloud Functions (Node.js)
│   ├── index.js             # Cloud function entry point
│   └── package.json         # Backend dependencies
│
└── assets/                  # Images, branding assets, & icons
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* A web browser (Google Chrome, Firefox, Edge, Safari).
* [Python 3.x](https://www.python.org/) or [Node.js](https://nodejs.org/) (for running a local server).
* A free [Firebase Account](https://firebase.google.com/) and [Google Gemini API Key](https://ai.google.dev/).

### 1. Clone the Repository
```bash
git clone https://github.com/ayush27-max/Ecolife.git
cd Ecolife
```

### 2. Configure Firebase Credentials
Open [`js/firebaseConfig.js`](file:///d:/Ecolife/js/firebaseConfig.js) and replace the placeholder values with your Firebase Web App credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Launch Local Server
You can run the included Python server script:
```bash
python server.py
```
Or using Node.js `npx`:
```bash
npx serve .
```

Navigate to `http://localhost:8000` in your web browser.

---

## 🔑 Environment & API Configuration

To enable the **AI Recycling Scanner** and **EcoBuddy Chat Assistant**:
1. Get a free API Key from [Google AI Studio](https://aistudio.google.com/).
2. You can set the key directly in the app settings UI (stored securely in browser `localStorage`), or set it in [`js/config.js`](file:///d:/Ecolife/js/config.js):

```javascript
window.ECOLIFE_CONFIG = {
    geminiApiKey: "YOUR_GEMINI_API_KEY",
    geminiModel: "gemini-3.5-flash-lite"
};
```

---

## 🌐 Cloud Deployment

EcoLife is configured for instant deployment with **Firebase Hosting**:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login & Link Project:
   ```bash
   firebase login
   firebase use --add
   ```
3. Deploy to Live URL:
   ```bash
   firebase deploy
   ```

---

## 📊 Project Report

For an in-depth technical analysis, system design specification, mathematical models, and database schematics, please read the complete [**PROJECT_REPORT.md**](PROJECT_REPORT.md).

---

## 🤝 Contributing & License

Contributions, bug reports, and feature proposals are welcome! 

1. Fork the Project on [GitHub](https://github.com/ayush27-max/Ecolife)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

This project is open-source under the **MIT License**.
