# PropPulse — AI Real Estate Intelligence & Property Valuation Platform

<div align="center">

![PropPulse Banner](src/assets/hero.png)

### **See It. Analyze It. Predict Its Value.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**PropPulse** is a next-generation AI-powered real estate intelligence and automated property valuation platform. Built with institutional-grade precision, PropPulse couples machine learning predictive models with real-time 3D WebGL spatial twins, interactive CAD blueprints, micro-market comps benchmarking, and explainable AI (SHAP-style) transparency.

[Live Demo](http://localhost:5173/) • [Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment)

</div>

---

## 🌟 Key Features

### 1. 🤖 AI Property Valuation Engine
* **Machine Learning Pricing**: Real-time predictive pricing based on structural specifications, age, carpet area, furnishings, and regional micro-market dynamics.
* **Explainable AI (XAI)**: SHAP-style breakdown displaying exact positive and negative valuation drivers (e.g., *Double Height Living Room: +₹4.2L*, *North-East Vastu Facing: +₹2.1L*).
* **Neural Scanning Simulation**: 5-step visual loading sequence simulating architectural feature extraction, computer vision facade audit, and comp variance analysis.
* **Computer Vision Facade Audit**: Bounding-box detection for balcony glazing, covered parking bays, and exterior finish quality scores.

### 2. 📐 3D & 2D Spatial Architecture Studio
* **Interactive 3D Cutaway**: Real-time WebGL perspective with orbit controls, interactive room hotspots, and solar path daylight simulation (Morning, Gold, Twilight, Night).
* **Interactive 2D Vector CAD Blueprint**: Technical schematic with clickable room partitions, real-time square footage calculation, and dimension badges.
* **Spatial Zoning Mode**: Heatmap overlay visualizing circulation corridors, private quarters, and entertaining suites.
* **Synchronized Split View**: 50/50 side-by-side workspace linking 3D perspective with 2D blueprint rooms.
* **PiP 2D Minimap Radar**: Floating live radar with camera field-of-view (FOV) flashlight cone.

### 3. 🏡 Interactive 3D Architectural Explorer
* **Procedural Three.js Customizer**: Customize exterior colors (Pure White, Slate Gray, Desert Sand, Horizon Blue), roof profiles (Flat Terrace vs Sloped Gable), architectural styles, and dynamic amenity modules (Pool, Garden, Balcony, Accent Spotlights).

### 4. 📊 Executive Intelligence Dashboard
* **Macro & Micro Metrics**: Median price/sq.ft, quarterly appreciation curves, and 90% confidence interval estimations (P10 to P90).
* **Regional Micro-Markets**: Dedicated deep-dive analytics calibrated for key high-growth hubs:
  * **Jaipur**: Malviya Nagar, Vaishali Nagar, C-Scheme, Jagatpura, Mansarovar.
  * **Jodhpur**: Shastri Nagar, Ratanada, Sardarpura, Paota, Pal Road.
  * **Kota**: Talwandi, Kunhari, Vigyan Nagar, Dadabari, Mahaveer Nagar.

### 5. ⚖️ Property Discovery & Comparison Matrix
* Side-by-side comparison across any 2–3 properties evaluating Price/sq.ft, AI Confidence, Energy Efficiency, RERA Compliance, and Yield Estimates.

### 6. 🌓 Unified Single-Page Continuous Canvas
* Seamless single-page application with smooth-scrolling sticky navigation and `IntersectionObserver` scroll-spy tracking.
* Persistent Dark & Light theme modes tailored with pure CSS design tokens.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **3D & Spatial Graphics** | [Three.js](https://threejs.org/) (WebGL) |
| **Vector CAD / Charts** | Native SVG & CSS Canvas Visualizations |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | Pure Vanilla CSS (CSS Variables, Glassmorphism, Dark/Light tokens) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thedevil-7/Propplus.git
   cd Propplus
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## ☁️ Deployment

### Deploy on Vercel

The repository includes a ready-to-use [`vercel.json`](vercel.json) configuration:

1. Import this repository on [Vercel](https://vercel.com/new).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**!

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
