# Phase 4: Frontend Architecture

This document outlines the frontend single-page application (SPA) architecture designed for the SecureLens console.

---

## 🛠 Tech Stack & Core Dependencies
- **React & TypeScript**: Strong typing for API schemas and component properties.
- **TanStack Router**: Fully typed, file-based routing mapping paths statically.
- **Tailwind CSS v4**: Utility-first CSS compiling with maximum speed.
- **Monaco Editor (`@monaco-editor/react`)**: Renders a production-grade code editor workspace with custom language styling and line tracking.
- **Framer Motion (`motion/react`)**: Micro-animations for page transitions, scanner loading overlays, and scroll reveals.
- **Lucide Icons**: Grayscale vector icons for minimal interface accents.

---

## 🛣 Route Mappings
We implement a clean path split to differentiate the marketing funnel from the security tool:
- **`src/routes/index.tsx` &rarr; `/` (Landing Page)**: Centered display headlines, scroll-revealed vertical pipelines, product showreels, and technical grids.
- **`src/routes/app.tsx` &rarr; `/app` (Dashboard)**: The interactive scanner console.

---

## ⚙ State Management
The main dashboard page (`src/routes/app.tsx`) maintains a unified state machine for the scanning lifecycle:
- **`viewState`**: `"idle" | "scanning" | "result"`.
  - `"idle"`: Blank monaco canvas with demo load buttons.
  - `"scanning"`: Animates a pipeline loader step-by-step (AST Traversal, context retrieval, AI validation).
  - `"result"`: Displays metrics, active findings list, code highlights, and secure fix comparisons.
- **`code`**: Holds raw string value of code in Monaco editor.
- **`scanResult`**: Validated `ScanResponse` returned from FastAPI.
- **`networkMs`**: Latency timing tracking the round-trip overhead of request transport.

---

## 🏗 Component Layout
Frontend components are structured strictly:
- **`/components/landing/`**:
  - `LandingNav.tsx` – Floating responsive menu with scroll blur.
  - `HeroSection.tsx` – Display typography, main CTA redirect, and browser mockup.
  - `ProblemSection.tsx` – Minimal whitespace-focused two-sentence layout.
  - `ArchitectureSection.tsx` – Animated vertical pipeline steps.
  - `FeaturesSection.tsx` – Three features cards with grid-based boundaries.
  - `ShowcaseSection.tsx` – Immersive full-width console preview.
  - `TechSection.tsx` – Grayscale icons for Python, FastAPI, React, Gemini, Railway, and Vercel.
  - `LandingFooter.tsx` – Attribution.
- **`/components/dashboard/`**:
  - `Header.tsx` – Top dashboard logo, text description, and version badges.
  - `DemoButtons.tsx` – Presets to load vulnerable code instantly (SQL injection, Command injection, Path traversal).
  - `CodeEditor.tsx` – Monaco wrapper.
  - `PipelineLoader.tsx` – Multi-step security workflow animation.
  - `MetricsCards.tsx` – Displays scan findings counts, lines scanned, risk scores, and latency breakdowns.
  - `FindingsList.tsx` & `FindingCard.tsx` – Explanations, OWASP metrics, attack vectors, and side-by-side code diffs.
