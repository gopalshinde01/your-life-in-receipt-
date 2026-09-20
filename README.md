# 🧾 Your Life in Receipt

> **A tangible, privacy-first personal ledger that transforms daily life into an itemized thermal receipt.**  
> Built for the Frontend Engineering Hackathon • 100% Client-Side • Zero External Server or Database Required.

---

## 📖 Table of Contents

1. [Project Idea & Vision](#-project-idea--vision)
2. [Problem Statement](#-problem-statement)
3. [Why This Project Is Different](#-why-this-project-is-different)
4. [Main Features](#-main-features)
5. [How the Life Receipt Works](#-how-the-life-receipt-works)
   - [Itemization Engine](#itemization-engine)
   - [Weighted Life Score Formula](#weighted-life-score-formula)
6. [Mock AI Insight System (Deterministic Local Heuristics)](#-mock-ai-insight-system)
7. [Technology Stack](#-technology-stack)
8. [Project Architecture & Folder Structure](#-project-architecture--folder-structure)
9. [LocalStorage Usage & Crash-Proof Resilience](#-localstorage-usage--crash-proof-resilience)
10. [Performance & Core Web Vitals](#-performance--core-web-vitals)
11. [Accessibility (a11y) & Keyboard Navigation](#-accessibility-a11y--keyboard-navigation)
12. [Security & Data Safety Practices](#-security--data-safety-practices)
13. [Testing & Quality Assurance](#-testing--quality-assurance)
14. [Installation & Local Setup](#-installation--local-setup)
15. [Building & Deployment](#-building--deployment)
16. [Future Roadmap](#-future-roadmap)
17. [License](#-license)

---

## 💡 Project Idea & Vision

We constantly receive receipts for our purchases—coffee, groceries, electronics. But we never get a receipt for the most valuable resources we spend: **our time, our attention, our daily energy, and our emotional focus.**

**Your Life in Receipt** flips the metaphor of transactional consumerism into mindful self-reflection. It itemizes your day as an authentic, vintage 80mm thermal docket, showing you exactly where your hours and money went, how your compounded goals advanced, and how your subjective mood felt.

---

## 🎯 Problem Statement

Traditional self-tracking and habit applications suffer from two major pitfalls:
1. **Overwhelming Complexity**: Heavy dashboards with endless menus, charts, and notifications that lead to cognitive fatigue and abandonment.
2. **Privacy & Data Exploitation**: Most apps require mandatory logins, cloud servers, and third-party trackers that commercialize intimate personal habits and financial transactions.

**Your Life in Receipt** solves this with:
- Zero account creation or backend tracking.
- Instant, tangible visual dockets that communicate a day's value in seconds.
- 100% private, client-side data storage staying exclusively on the user's device.

---

## ⚡ Why This Project Is Different

- **The Thermal Receipt Metaphor**: Instead of generic SaaS cards, data is rendered with monospace typography, dot leaders, jagged edge tears, barcodes, and authentic paper texture.
- **Physical-Digital Bridge**: Ready-to-print CSS formatting for actual 80mm POS thermal printers and high-resolution PNG downloads for instant sharing.
- **Transparent Deterministic Scoring**: No black-box algorithms. Every score component is mathematically visible and explained.
- **Multi-Language Inclusion**: Complete native localization across **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)**.
- **Resilient Zero-Crash Design**: Corrupted LocalStorage, negative inputs, and network disconnections never crash the app.

---

## ✨ Main Features

- 🧾 **Interactive Thermal Receipt**: Real-time rendering with dot leaders, calculated totals, jagged paper tears, barcodes, and custom theme styling.
- 🖨️ **Thermal Paper Feed Simulation**: Realistic interactive paper feeding animation with full respect for `prefers-reduced-motion`.
- 📊 **Living Ledger Dashboard**: Direct-access home view summarizing daily time tracked, money spent, goals completed, average mood, and the composite Life Score.
- ➕ **Multi-Category Quick Logger**:
  - **Activity Tracking**: Durations clamped to 24h realistic boundaries with category tags.
  - **Expense Ledger**: Amounts validated with strict numeric, non-negative, finite constraints.
  - **Compounded Goals**: Percentage progress tracking with celebratory confetti bursts on completion.
  - **Vibe / Mood Check-In**: Dynamic 1–10 slider with live emoji reaction.
- 🎨 **Two Focused Themes**:
  - `Classic Thermal`: Warm obsidian backdrop, vintage beige thermal docket (`#faf8f5`), dark warm ink, and amber accents.
  - `Pure White (Light)`: Clean daylight mode with pure white docket (`#ffffff`), light slate backdrop, and dark typography.
- 🌐 **Integrated Preferences Control**: Consolidated popover seamlessly grouping theme toggle and regional language selection in sequence.
- 💬 **User Feedback & Audit Portal**: Built-in accessible modal dialog allowing users to submit ratings (1-5 stars with emoji reaction), categorized feedback (Feature Request, Bug Report, General, Receipt Suggestion), and comments persisted locally to `life_receipt_feedback_v1`.
- 📥 **Export Capabilities**:
  - **Download as PDF / Print**: Formatted with print media queries specifically for receipt roll layouts.
  - **Download as PNG**: Pure client-side HTML5 canvas snapshot.
  - **Copy Plain Text**: Monospace clipboard-ready text summary.

---

## ⚙️ How the Life Receipt Works

### Itemization Engine
When the receipt generates, the `receiptService` executes a deterministic pipeline:
1. Filters activities and expenses matching the selected calendar date.
2. Aggregates time spent across categories (Coding, Study, Work, Exercise, Reading, etc.) and formats into `XXh YYm`.
3. Sums financial expenses by category (Food, Travel, Utilities, Shopping, etc.) and formats with user's chosen currency symbol (`₹`, `$`, `€`, `£`, `¥`).
4. Extracts completed achievements and in-progress targets.
5. Computes a unique deterministic receipt identifier: `RCPT-YYYYMMDD-XXXX`.

### Weighted Life Score Formula
The Life Score Index is calculated out of 100 based on five transparent parameters:

$$\text{Life Score} = (P \times 0.30) + (H \times 0.20) + (M \times 0.20) + (G \times 0.20) + (B \times 0.10)$$

Where:
- **$P$ (Productivity - 30%)**: Ratio of constructive output (Coding, Study, Work, Reading) vs. passive distractions (clamped 0–100).
- **$H$ (Health & Habits - 20%)**: Physical exercise, meditation, and healthy habit allocation.
- **$M$ (Mood & Morale - 20%)**: Normalized average of daily emotional check-ins ($rating \times 10$).
- **$G$ (Goal Progress - 20%)**: Proportion of active goals completed or progressing forward.
- **$B$ (Daily Balance - 10%)**: Variance penalty ensuring the user didn't spend >14 hours exclusively in one extreme.

---

## 🧠 Mock AI Insight System

> **Honesty & Transparency Note**: This project does **NOT** use an external AI backend, paid OpenAI API, or cloud LLM. All reflections are generated **locally and deterministically** in the browser using the client-side `insightService`.

### How It Works
The engine analyzes the user's actual daily log using rule-based heuristics:
- **Dominant Productive Activity**: Calculates the single largest productive category. If significant, generates a personalized reflection:  
  *Example: "You spent 3h 20m on Study today — your largest productive activity."*
- **Work-Life Synergy**: Checks if deep work was balanced with exercise (e.g., $\ge 120\text{m}$ coding $+ \ge 30\text{m}$ exercise):  
  *Example: "High deep work backed with intentional movement. You balanced cognitive output with physical health."*
- **Distraction Warning**: Detects excessive social media with minimal focus blocks and suggests recovery strategies.
- **Future Ready**: Built with clean async-ready TypeScript interfaces (`InsightInputData`), enabling seamless plug-in of WebLLM or external AI models if desired in the future.

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | **React 18** | Declarative component UI and reactivity |
| **Language** | **TypeScript 5.7** | Type safety, strict compiler checks (`noUnusedLocals`) |
| **Routing** | **React Router v6** | Client-side routing with v7 future flag compatibility |
| **Styling** | **Tailwind CSS 3.4** | Utility-first styling with custom theme tokens |
| **Build Tool** | **Vite 6** | Ultra-fast HMR and production bundle rollup |
| **Unit Testing** | **Vitest 3** | Fast test runner with Jest-compatible API |
| **DOM Testing** | **Testing Library** | Component & accessible user interaction testing |
| **Icons** | **Lucide React** + Native Unicode | Lightweight, zero-layout-shift iconography |

---

## 📁 Project Architecture & Clean Folder Structure

```
Your Life In Receipts/
├── src/
│   ├── components/
│   │   ├── activities/       # Activity list and duration-validated form
│   │   ├── analytics/        # Pure SVG/CSS category distribution charts
│   │   ├── common/           # Button, Input, Modal, ErrorBoundary, StatCard, etc.
│   │   ├── dashboard/        # QuickSummary KPI cards, ScoreOverview breakdown
│   │   ├── expenses/         # Expense itemization and validated form
│   │   ├── goals/            # Compounding goal cards and progress tracker
│   │   ├── insights/         # Local heuristic reflection feed
│   │   ├── layout/           # Backwards-compatible layout re-exports
│   │   └── receipt/          # LifeReceipt docket, DotLeader, Barcode, TearEdges
│   ├── context/              # LifeContext & LifeProvider for centralized state access
│   ├── layouts/              # AppLayout, Header, Footer, PageContainer, SkipLink
│   ├── constants/            # Categories, Storage Keys, Routes, Default Profile
│   ├── data/                 # Deterministic sample seed data for evaluation
│   ├── hooks/                # useLifeData (Full CRUD), useTheme, useLanguage, useToast
│   ├── i18n/                 # Translation dictionaries (English, हिन्दी, मराठी)
│   ├── pages/                # Dashboard, Receipt, AddEntry, Analytics, Profile, etc.
│   ├── services/             # storageService, receiptService, insightService, trendService
│   ├── styles/               # index.css (Tailwind layers, thermal styling, a11y motion)
│   ├── tests/                # 15 Vitest test suites (50 tests covering calculations, CRUD, trends, a11y)
│   ├── types/                # TypeScript domain models and interfaces
│   ├── utils/                # calculations, validators, sanitizers, formatters, confetti
│   ├── App.tsx               # Main router, error boundary, suspense fallback, context provider
│   └── main.tsx              # React DOM bootstrap with root Error Boundary
├── public/                   # Static assets, 404.html fallback, _redirects
├── docs/                     # Compiled production build for GitHub Pages hosting
├── .github/workflows/        # Automated GitHub Pages build & deployment workflow
├── package.json              # Project dependencies & npm scripts
├── tailwind.config.js        # Theme color tokens, custom box shadows
├── tsconfig.json             # Strict TypeScript configuration
└── vite.config.ts            # Vite build setup with code-splitting & manualChunks
```

---

## 🛡️ LocalStorage Usage & Crash-Proof Resilience

All state persists in `window.localStorage` under versioned keys (`life_receipt_*_v1`).

The `storageService` acts as a defensive guardian:
- **Safe JSON Parsing**: Every retrieval is wrapped in `try/catch`.
- **Corrupted Data Recovery**: If invalid or truncated JSON is found in LocalStorage, it logs a silent warning and immediately falls back to safe defaults without crashing the UI.
- **Type Checking**: Verifies that arrays remain arrays and objects remain objects before passing data to state hooks.
- **Sanitized IDs**: All new records generate unique, collision-resistant IDs (`generateSafeId`).

---

## 🚀 Performance & Core Web Vitals

- **Code-Splitting via `React.lazy()`**: Secondary routes (Receipt, Analytics, Insights, Goals, Expenses, Activities, Profile, 404) are loaded only when requested, keeping initial bundle size low.
- **Zero Cumulative Layout Shift (CLS ~ 0)**:
  - Fixed-height metric cards and loading skeletons reserve space before render.
  - Pure CSS/SVG charts dynamically scale without reflowing text.
- **Interaction to Next Paint (INP)**:
  - Synchronous form submissions complete in `< 16ms`.
  - Heavy canvas rendering (PNG export) only executes on explicit user click.
- **Bundle Metrics**:
  - Gzipped JS: ~80 kB
  - Gzipped CSS: ~9 kB
  - Total production build time: **~2.5 seconds**

---

## ♿ Accessibility (a11y) & Keyboard Navigation

Built to comply with **WCAG 2.1 AA** guidelines:
- **Keyboard Traversal**: Full navigation through `Tab`, `Shift+Tab`, `Enter`, and `Space`.
- **Modal Focus Trap**: The `useFocusTrap` hook traps focus inside open dialogs, allows `Escape` key dismissal, and returns focus to the triggering element.
- **Accessible Form Elements**: Every `input`, `select`, and `textarea` has a matching `<label htmlFor="...">`.
- **ARIA Verification**:
  - `aria-invalid` on inputs failing validation.
  - `aria-describedby` linking inputs to dynamic error messages.
  - `role="alert"` for real-time validation warnings.
  - `role="tablist"` / `role="tab"` with `aria-selected` on the tab navigation.
- **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- **Skip Navigation**: Accessible `<SkipLink />` at the very top of the DOM allowing screen reader and keyboard users to bypass header links directly to `#main-content`.

---

## 🔒 Security & Data Safety Practices

Although this is a client-side frontend project, security best practices are strictly enforced:
- **Zero Unsafe DOM Injections**: No `dangerouslySetInnerHTML`, no `eval()`, and no dynamic `new Function()` calls.
- **String Sanitization**: [sanitizers.ts](src/utils/sanitizers.ts) strips all `<script>` tags, raw HTML, and control characters before saving to LocalStorage.
- **URL Protocol Validation**: Restricts external links strictly to `http:` and `https:`, blocking malicious `javascript:` or `data:` URL injections.
- **Boundary Clamping**:
  - Durations: Clamped to $[0, 1440]$ minutes/day.
  - Expenses: Clamped to $[0, 100,000,000]$ with rejection of `NaN` and `Infinity`.
  - Moods: Clamped to $[1, 10]$.
  - Goals: Clamped to $[0, 100]\%$.

---

## 🧪 Testing & Quality Assurance

The project includes **15 Vitest test suites containing 50 tests** with a **100% pass rate**:

```bash
# Run all tests once
npm run test

# Run tests in interactive watch mode
npm run test:watch
```

### Test Coverage Breakdown (16 Test Suites • 53 Tests • 100% Passing)

1. `calculations.test.ts`: Mathematical verification of total time, expenses, productivity ratio, and weighted Life Score.
2. `security.test.ts`: Rejection of `<script>` injection, HTML tag stripping, URL scheme safety, boundary checks.
3. `storage.test.ts`: LocalStorage persistence, defensive fallback on corrupted JSON, schema integrity.
4. `crud.test.ts`: End-to-end update operations for activities, expenses, and goal progress milestones.
5. `trends.test.ts`: Weekly period-over-period percentage changes, top category identification, zero-base safety.
6. `context.test.tsx`: Centralized `LifeProvider` delivery, consumer reactivity, and boundary enforcement.
7. `Feedback.test.tsx`: User rating selection, category selection, validation, LocalStorage recording, and toast alerts.
8. `Receipt.test.tsx`: Component rendering, itemized rows, dot leaders, totals, barcode, Life Score.
9. `Expenses.test.tsx`: Valid submission, negative amount rejection with accessible error alert.
10. `Activities.test.tsx`: Duration boundary validation, max 1440 min rejection.
11. `Goals.test.tsx`: Goal card rendering, completion toggle, progress updates.
12. `Navigation.test.tsx`: Root route `/` opening Dashboard directly, `/landing` accessibility, 404 fallback.
13. `theme.test.tsx`: Two-theme sequence verification, `ThemeSelector`, and `ThemeLanguageControl`.
14. `i18n.test.tsx`: Dictionary coverage for all 3 languages, fallback handling, localized rendering.
15. `App.test.tsx`: Full top-level App mounting and error boundary verification.
16. `ECell.test.tsx`: Institutional portal branding, venture showcase, and applicant modal.

---

## 📥 Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/gopalshinde01/your-life-in-receipt-.git

# 2. Enter project folder
cd your-life-in-receipt-

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be live at: **`http://localhost:5173/`**

---

## 📦 Building & Deployment

### Production Build
```bash
npm run build
```
This compiles TypeScript via `tsc` and bundles assets via `vite build` into the `/dist` folder.

### Local Production Preview
```bash
npm run preview
```
Runs a local web server hosting the optimized `/dist` bundle at `http://localhost:4173/`.

### Deployment Instructions (Vercel / Netlify / GitHub Pages)
This project is **100% static client-side**. It requires zero environment variables or backend configuration:
- **Vercel**: Import repository, framework preset: `Vite`, build command: `npm run build`, output directory: `dist`.
- **Netlify**: Connect repository, build command: `npm run build`, publish directory: `dist`. Add a `_redirects` file (`/* /index.html 200`) for single-page app routing.
- **GitHub Pages**: Build the repository and deploy the `dist` folder via `gh-pages` or GitHub Actions.

---

## 🔮 Future Roadmap

- 📱 **Web Bluetooth Thermal Printing**: Direct pairing with portable Bluetooth ESC/POS receipt printers.
- 🤖 **WebLLM Integration**: Option to run client-side lightweight LLMs (like Phi-3 or Llama-3-mini) entirely inside WebAssembly for rich natural language narratives.
- 🔄 **Encrypted Export / Import**: Password-protected JSON file backup allowing users to transfer receipts between devices securely.
- 📆 **Weekly & Monthly Rollups**: Multi-day receipt rolls for holistic monthly retrospectives.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with care by **Gopal Shinde** • *Every moment lived is an entry in your permanent record.*
