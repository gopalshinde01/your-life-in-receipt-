# 🧾 Your Life In Receipt

> **Personalized Digital Life Audit & Living Thermal Receipt Ledger**  
> Built for the Frontend Hackathon • 100% Client-Side • Zero Backend Required

---

## 🌟 Overview

**Your Life In Receipt** is an interactive, privacy-first personal ledger that audits your day. It transforms your daily hours tracked, financial expenditures, habit goals, and emotional vibe into an authentic, itemized **80mm thermal receipt docket**.

Everything runs directly in your browser using structured LocalStorage persistence with defensive fallback recovery.

---

## 🚀 Key Features

- 🧾 **Authentic Thermal Docket**: Realistic receipt layout featuring jagged tear edges, dot leaders, barcodes, category breakdowns, and personalized signatures.
- 🖨️ **Dual Export Formats**: One-click **PDF Print** (custom 80mm print media styles) and **PNG Image Download** (canvas snapshot).
- ⚡ **Weighted Life Score Index**: Transparent mathematical formula aggregating Productivity (30%), Health & Habits (20%), Mood & Morale (20%), Goal Progress (20%), and Balance (10%).
- 🎨 **Two Curated Themes**:
  - `Classic Thermal`: Deep obsidian backdrop with authentic warm beige receipt paper and amber accents.
  - `Pure White (Light)`: Clean daylight mode with pure white paper, crisp light slate backdrop, and dark typography.
- 🌐 **Multi-Language Support (i18n)**: Seamless instant switching between **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)** with comprehensive translation dictionaries.
- 📱 **Responsive & Accessible**: Sticky glass navbar, touch-friendly 44px+ hit targets, full keyboard navigation with visible focus rings, and WCAG AA contrast compliance.
- 🛡️ **Defensive Security & Resilience**: HTML/script sanitization on all text fields, protocol validation against malicious URLs, and corrupted JSON storage recovery.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript 5
- **Routing**: React Router v6 (configured with React 19 / v7 future flags)
- **Styling**: Tailwind CSS with custom theme token overrides
- **Testing**: Vitest + React Testing Library (11 test suites, 42 tests, 100% pass rate)
- **Build Tool**: Vite 6 (sub-2.5s production bundle)

---

## 🧪 Testing & Quality Assurance

Run the comprehensive unit, integration, and accessibility test suites:

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:
- Weighted Life Score calculations & edge cases
- Input sanitization & XSS injection prevention
- Corrupted LocalStorage auto-recovery
- Dynamic receipt itemization & calculations
- Multi-language dictionary verification
- Theme switching & accessible ARIA controls

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/gopalshinde01/your-life-in-receipt-.git

# Navigate to project directory
cd your-life-in-receipt-

# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 License

MIT License © 2026 Gopal Shinde. Built with passion at D Y Patil Technical Campus, Talsande.
