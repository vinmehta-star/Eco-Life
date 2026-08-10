# 📘 Project Report: EcoLife — Gamified Sustainability & Carbon Footprint Platform

**Repository**: [https://github.com/ayush27-max/Ecolife](https://github.com/ayush27-max/Ecolife)  
**Date**: August 2026  
**Document Version**: 1.0.0  

---

## 📌 Executive Summary

**EcoLife** is an innovative, full-stack gamified web application designed to encourage sustainable living practices, increase environmental awareness, and enable individuals to measure and reduce their personal carbon footprint. By combining real-time environmental calculation engines, gamification mechanics (GreenScore, level progression, streaks, badges, eco-certificates), AI-powered waste classification using Google Gemini, and interactive data visualization (Canvas-rendered Impact Trees and Chart.js analytics), EcoLife transforms passive eco-awareness into active, habitual behavior change.

The project is engineered as a zero-overhead, high-performance Single Page Application (SPA) utilizing native JavaScript (ES Modules), modular Vanilla CSS3, Cloud Firestore for cloud synchronization, and Google Gemini AI for computer vision waste identification.

---

## 🎯 1. Problem Statement & Objectives

### 1.1 The Problem
Despite growing global awareness regarding climate change, individual climate action often stalls due to three major barriers:
1. **Abstract Metrics**: Carbon footprint figures (e.g. $kg\text{ CO}_2$) are abstract and hard for everyday consumers to visualize or relate to daily habits.
2. **Lack of Immediate Incentive**: Sustainable actions rarely yield immediate feedback, making habit formation difficult.
3. **Confusion in Waste Disposal**: Complex municipal recycling guidelines and material identification lead to high rates of recycling contamination.

### 1.2 Project Objectives
* **Quantify Impact**: Provide immediate, scientifically backed carbon emission calculations across daily activities (transportation, household energy, diet, waste, water usage).
* **Gamify Action**: Implement a GreenScore engine with daily streaks, tier levels, unlockable badges, and community leaderboards to incentivize repeat engagement.
* **Visualize Progress**: Render an interactive, dynamic Impact Tree that visually grows and blooms as the user logs sustainable actions.
* **Democratize Waste Classification**: Integrate artificial intelligence via Google Gemini Vision API to instantly classify household items into proper recycling streams.

---

## 🏗️ 2. System Architecture & Component Design

EcoLife employs a client-heavy, serverless architecture that functions seamlessly across both offline and online environments.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               USER BROWSER                                  │
│                                                                             │
│  ┌─────────────────┐    ┌────────────────────┐    ┌──────────────────────┐  │
│  │   Hash Router   │ ──▶│  State Management  │ ──▶│   View Controllers   │  │
│  │  (#dashboard,   │    │ (state.js + Local) │    │  (Calc, Tree, AI,    │  │
│  │   #calculator)  │    └─────────┬──────────┘    │   Missions, Comm)    │  │
│  └─────────────────┘              │               └──────────────────────┘  │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐         ┌────────────────────┐       ┌──────────────────────┐
│ Firebase Auth│         │   Cloud Firestore  │       │  Google Gemini REST  │
│  (Auth State)│         │ (User Docs & Sync) │       │ (Vision & EcoBuddy)  │
└──────────────┘         └────────────────────┘       └──────────────────────┘
```

### 2.1 Architectural Components
1. **SPA Hash Router ([`js/router.js`](file:///d:/Ecolife/js/router.js))**: Decouples views into modular components loaded dynamically upon hash route change (`#dashboard`, `#calculator`, `#recycling`, `#missions`, `#community`, `#tree`, `#profile`).
2. **Reactive State Manager ([`js/state.js`](file:///d:/Ecolife/js/state.js))**: Implements a single source of truth for application state. Emits reactive events (`stateChanged`) to update UI components without full page reloads.
3. **Cloud & Sync Layer ([`js/services/sync.js`](file:///d:/Ecolife/js/services/sync.js))**: Coordinates automatic two-way synchronization between browser `localStorage` and Google Cloud Firestore.
4. **AI Integration Layer ([`js/services/gemini.js`](file:///d:/Ecolife/js/services/gemini.js))**: Communicates directly with Google Gemini REST endpoints for multimodal vision classification and conversational natural language processing.

---

## 🧮 3. Mathematical Models & Engine Specifications

### 3.1 Carbon Footprint Calculation Model
Carbon savings are calculated based on standardized global emission factors stored in [`js/data/carbonFactors.js`](file:///d:/Ecolife/js/data/carbonFactors.js).

#### Daily & Projected Carbon Metrics:
$$\text{Daily Average } (kg) = \frac{\text{Total } CO_2 \text{ Saved (kg)}}{\max(1, \text{Days Since Joining})}$$

$$\text{Annual Projection } (kg) = \text{Daily Average} \times 365$$

#### Real-World Equivalencies:
To make carbon figures intuitive, the engine converts $kg\text{ CO}_2$ into practical equivalencies:
* **Trees Absorbing $CO_2$**: $\text{Trees} = \frac{kg\text{ CO}_2}{22.0}$
* **Car Driving Avoided**: $\text{Kilometers} = \frac{kg\text{ CO}_2}{0.21}$
* **LED Hours Saved**: $\text{Hours} = kg\text{ CO}_2 \times 200$
* **Smartphone Charges**: $\text{Charges} = \frac{kg\text{ CO}_2}{0.008}$
* **Beef Meals Replaced**: $\text{Meals} = \frac{kg\text{ CO}_2}{6.61}$

---

### 3.2 GreenScore & Leveling Algorithm
The GreenScore engine ([`js/engines/greenScore.js`](file:///d:/Ecolife/js/engines/greenScore.js)) determines user progression using a non-linear quadratic leveling curve.

#### Level Formula:
$$\text{Level} = \left\lfloor \sqrt{\frac{\text{GreenScore}}{50}} \right\rfloor + 1$$

#### Streak Multiplier Formula:
Daily engagement awards a multiplier $M_{streak}$ applied to all mission points earned:
$$M_{streak} = \min(2.0, \, 1.0 + (\text{Streak Days} \times 0.1))$$

$$\text{Points Earned} = \text{Base Points} \times M_{streak}$$

#### Level Progression Tiers:
| Level Range | Tier Title | Tree Visual Stage |
| :--- | :--- | :--- |
| **Level 1** | Seedling | Seed ($\text{Stage } 1$) |
| **Level 2–3** | Sprout / Sapling | Sapling ($\text{Stage } 2$) |
| **Level 4–5** | Green Scout / Eco Ranger | Young Tree ($\text{Stage } 3$) |
| **Level 6–8** | Nature Knight / Forest Guardian / Earth Sage | Mature Tree ($\text{Stage } 4$) |
| **Level 9+** | Planet Champion / Eco Legend | Ancient Tree ($\text{Stage } 5$) |

---

### 3.3 Parametric Impact Tree Rendering Engine
The Impact Tree component ([`js/components/impactTree.js`](file:///d:/Ecolife/js/components/impactTree.js)) leverages the **HTML5 Canvas API** to draw recursive fractal trees whose parameters adjust based on the user's GreenScore.

* **Fractal Recursion Depth**: Increases with level (Depth 4 to Depth 8).
* **Foliage Density & Color Shifting**: Transitioning from soft yellow-green leaves to vivid emerald green and blooming pink blossoms as points increase.
* **Interactive Physics Engine**: Falling leaf particle simulation responding to mouse hovering and click events.

---

## 🤖 4. AI Scanner & EcoBuddy Specifications

EcoLife integrates **Google Gemini API** (`gemini-3.5-flash-lite`) for multimodal intelligence.

### 4.1 Vision-Based AI Recycling Scanner
* **Process Flow**:
  1. User captures or selects an image file in the UI.
  2. Image is converted to Base64 format client-side.
  3. Image and structured prompt are sent to `generateContent` endpoint.
  4. Response is enforced as strict JSON returning item name, bin classification, step-by-step disposal steps, and estimated carbon savings.
* **Structured Output Schema**:
```json
{
  "itemName": "Plastic Water Bottle",
  "emoji": "🍾",
  "category": "Plastics",
  "isRecyclable": true,
  "bin": "recycling",
  "binLabel": "Blue Recycling Bin",
  "disposalSteps": ["Empty liquids", "Rinse container", "Replace cap", "Place in Blue Bin"],
  "co2Impact": 0.05
}
```

### 4.2 EcoBuddy Conversational AI
The chatbot ([`js/components/chatbot.js`](file:///d:/Ecolife/js/components/chatbot.js)) acts as an in-app sustainability coach:
* Maintains conversation history window.
* Injects eco-contextual system instructions to keep answers actionable, encouraging, and concise.
* Includes offline heuristic fallback responses when internet connectivity or API quota is limited.

---

## 💾 5. Database Schema & Data Models

### 5.1 Cloud Firestore Collections Structure

#### Collection: `users/{userId}`
```typescript
interface UserDocument {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  greenScore: number;
  level: number;
  co2Saved: number; // in kg
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string; // YYYY-MM-DD
  };
  badges: string[]; // Badge IDs
  completedMissions: Array<{
    missionId: string;
    completedAt: string;
    points: number;
    co2Saved: number;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

#### Collection: `community_posts/{postId}`
```typescript
interface PostDocument {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  category: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}
```

---

## 🎨 6. User Interface & Design System

EcoLife applies modern web design principles centered around clarity, vibrancy, and responsiveness:

* **Design Palette**: Nature-inspired emerald palette (`#10b981`, `#059669`, `#047857`, `#064e3b`) paired with dark glassmorphism surfaces (`rgba(15, 23, 42, 0.7)`).
* **Typography**: Clean, sans-serif font system utilizing `Inter` and system UI fonts.
* **Feedback Systems**: Dynamic audio feedback using Web Audio API sound synthesis for mission completion, button clicks, level-ups, and badge unlocks.

---

## 🧪 7. Verification & Testing

### 7.1 Quality Assurance Summary
* **Cross-Browser Verification**: Verified across Chromium-based browsers (Chrome, Edge) and WebKit (Safari).
* **Responsive Layout Testing**: Tested across viewport sizes ranging from Mobile (375px) to Desktop (1920px).
* **Offline Functionality**: Tested with simulated network disconnects; state modifications persist in `localStorage` and resynchronize with Cloud Firestore upon reconnection.

---

## 🚀 8. Future Roadmap

1. **IoT Smart Meter Integration**: Connect with home smart plugs and smart meters to track real-time electricity reduction.
2. **Native Mobile Applications**: Package application as a Progressive Web App (PWA) and React Native build for iOS & Android.
3. **Verified Carbon Offsetting**: Partner with verified global reforestation projects allowing users to redeem GreenPoints for real-world tree planting.

---

## 🏁 9. Conclusion

EcoLife successfully bridges the gap between environmental awareness and actionable sustainability. By uniting carbon footprint analytics, interactive visualization, gamified reward systems, and cutting-edge Google Gemini AI vision technology, EcoLife offers a complete, engaging blueprint for personal and community climate action.
