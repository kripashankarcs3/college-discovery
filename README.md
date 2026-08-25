<div align="center">

  <h1>🎓 College Discovery</h1>

  <p><b>India's Premier Smart College Discovery & AI Admission Predictor Platform</b></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://lenis.darkroom.engineering/"><img src="https://img.shields.io/badge/Lenis_Scroll-1.3-8B5CF6?style=for-the-badge" alt="Lenis Scroll" /></a>
  </p>

  <br />

</div>

---

## 🌟 About The Project

**College Discovery** is a modern, production-grade web application built to help Indian students find their dream colleges in seconds. It provides real-time college search, fee structure breakdowns, placement statistics, NIRF rankings, side-by-side comparisons, and an AI-powered admission predictor.

---

## ✨ Key Features

- 🎓 **Comprehensive College Directory**: Explore 500+ top Indian institutions (IITs, NITs, IIITs, IIMs, BITS, SRCC) with detailed profiles.
- ⚡ **AI Admission Predictor**: Input entrance exam ranks (JEE, NEET, CAT, CUET) to get instant admission probability predictions.
- ⚖️ **Side-by-Side Comparison Engine**: Compare multiple colleges across fees, highest packages, average packages, and NIRF rankings.
- 🏎️ **120Hz Liquid Inertia Scrolling**: Hardware-accelerated smooth scrolling integrated with Lenis engine for zero input lag.
- 🎨 **Sleek Production UI System**: Designed with glassmorphic cards, high-contrast Slate & Indigo SaaS typography, ambient light beams, and smooth micro-animations.
- 🌓 **Dynamic Light & Dark Theme**: Full theme switcher powered by CSS design tokens.
- 📱 **100% Mobile Responsive**: Fully optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | Custom CSS Tokens & [Tailwind CSS 3.4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Smooth Scroll** | [Lenis 1.3](https://lenis.darkroom.engineering/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Structure

```bash
college-discovery/
├── app/                      # Next.js App Router pages & API routes
│   ├── colleges/             # College directory & [id] detail page
│   ├── predictor/            # AI admission predictor page
│   ├── compare/              # Side-by-side comparison page
│   ├── dashboard/            # Student saved colleges dashboard
│   ├── Header.tsx            # Navigation header component
│   ├── layout.tsx            # Root layout & footer component
│   └── page.tsx              # Landing hero page
├── components/               # Reusable UI & feature components
│   ├── Logo.tsx              # Custom Graduation Cap logo component
│   ├── SmoothScroll.tsx      # Lenis smooth scroll engine wrapper
│   └── features/             # Feature cards & compare tables
├── context/                  # Global React context (ThemeContext)
├── lib/                      # Mock dataset & utility functions
├── public/                   # Static assets & background images
└── styles/                   # Design tokens & global CSS
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18.0.0** or higher installed on your system.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kripashankarcs3/college-discovery.git
   cd college-discovery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Builds the application for production deployment |
| `npm run start` | Starts the production server using built assets |
| `npm run lint` | Checks the codebase for linting errors |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [Issues page](https://github.com/kripashankarcs3/college-discovery/issues).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <br />
  <p>Made with ❤️ in India for Scholars & Future Leaders</p>
</div>
