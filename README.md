# 🎓 College Discovery

> **India's Premier Smart College Discovery & AI Admission Predictor Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Lenis Scroll](https://img.shields.io/badge/Lenis_Scroll-1.3-8B5CF6?style=for-the-badge)](https://lenis.darkroom.engineering/)

---

## 🌟 Overview

**College Discovery** is a modern, production-grade web application built to help Indian students find their dream colleges in seconds. It provides real-time college search, fee structure breakdowns, placement statistics, NIRF rankings, side-by-side comparisons, and an AI-powered admission predictor.

---

## ✨ Key Features

- 🎓 **Comprehensive College Directory**: Explore 500+ top Indian institutions (IITs, NITs, IIITs, IIMs, BITS, SRCC) with rich detail pages.
- ⚡ **AI Admission Predictor**: Input entrance exam ranks (JEE, NEET, CAT, CUET) to get instant admission probability predictions.
- ⚖️ **Side-by-Side College Comparison**: Compare multiple colleges across fees, highest packages, average packages, and NIRF rankings.
- 🏎️ **120Hz Liquid Inertia Scrolling**: Hardware-accelerated smooth scrolling integrated with Lenis engine for zero input lag.
- 🎨 **Sleek Production UI System**: Designed with glassmorphic cards, high-contrast Slate & Indigo SaaS typography, ambient light beams, and smooth micro-animations.
- 🌓 **Dynamic Light & Dark Theme**: Full theme switcher powered by CSS design tokens.
- 📱 **100% Mobile Responsive**: Fully optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | Vanilla CSS Tokens & [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Smooth Scroll** | [Lenis 1.3](https://lenis.darkroom.engineering/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Structure

```text
college-discovery/
├── app/                      # Next.js 16 App Router Pages
│   ├── colleges/             # Colleges Directory & Detail Pages ([id])
│   ├── predictor/            # AI Admission Predictor Tool
│   ├── compare/              # Multi-College Comparison Tool
│   ├── dashboard/            # Student Saved Colleges Dashboard
│   ├── Header.tsx            # Navigation Header with Theme Toggle & Logo
│   ├── layout.tsx            # Root Layout with Smooth Scroll & Footer
│   └── page.tsx              # High-Impact Hero Landing Page
├── components/               # Reusable UI & Feature Components
│   ├── Logo.tsx              # Custom Vector Graduation Cap & Discovery Emblem
│   ├── SmoothScroll.tsx      # Lenis Smooth Scroll Engine Wrapper
│   └── features/             # College Cards, Comparison Tables, Filters
├── context/                  # React Context Providers (ThemeContext)
├── lib/                      # Mock Data, Utilities, & Predictor Logic
├── public/                   # Static Images, Icons & Hero Backgrounds
└── styles/                   # Global CSS & Custom Design Tokens
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/kripashankarcs3/college-discovery.git
cd college-discovery
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

- `npm run dev` - Starts the development server at `http://localhost:3000`
- `npm run build` - Builds the application for production deployment
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code quality issues

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kripashankarcs3/college-discovery/issues).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ in India for Scholars & Future Leaders
</p>
