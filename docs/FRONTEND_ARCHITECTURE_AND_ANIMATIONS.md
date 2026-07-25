# 🛡️ SecureLens Frontend Architecture & Motion Design Documentation

This document provides an in-depth breakdown of the SecureLens frontend implementation, design system philosophy, framework selections, animation engineering, 3D Canvas mathematics, and 2-page routing architecture.

---

## 🎨 1. Design System Philosophy & Aesthetic Vision

SecureLens adheres to the **Dala & Apple-inspired Void Aesthetic**:
- **Canvas Base**: Pure obsidian black velvet (`#000000` / `#050505`).
- **Typography**: Weightless typography utilizing Google Inter (`font-weight: 200` for display headlines, `400` for body copy, and `500` for action buttons).
- **Color System**:
  - **Primary Accent**: Dala Violet / Electric Iris (`#8052ff` / `#6366F1`)
  - **Punctuation & Highlights**: Saffron Spark (`#ffb829`)
  - **Secondary Accents**: Cyber Cyan (`#06b6d4`) & Emerald Safe (`#22c55e` / `#4ade80`)
  - **Text Colors**: Paper White (`#ffffff`), Pearl (`#e0e0e0`), and Stone Gray (`#a0a0a0`)
- **Surfaces & Borders**: Glassmorphic panels with subtle backdrop blurs (`backdrop-filter: blur(16px)`) and semi-transparent borders (`border: 1px solid rgba(255, 255, 255, 0.08)`).

---

## 🛠️ 2. Core Tech Stack & Framework Selection

| Library / Tool | Version | Purpose & Usage |
|---|---|---|
| **React** | `v19.2.0` | Core UI library for component state and rendering. |
| **TanStack Start** | `v1.168` | Full-stack SSR (Server-Side Rendering) framework powering the web app. |
| **TanStack Router** | `v1.170` | Type-safe file-based client & server routing (`src/routes/`). |
| **Framer Motion (`motion/react`)** | `v12.42` | Physics-based animations, scroll triggers, layout morphing, and gestures. |
| **TailwindCSS** | `v4.2.1` | Utility-first styling framework integrated with Vite. |
| **Monaco Editor (`@monaco-editor/react`)** | `v4.7.0` | VS Code-grade code editor for Python vulnerability auditing. |
| **Lucide React** | `v0.575` | High-precision vector iconography. |
| **Sonner** | `v2.0.7` | Toast notification engine for export and scan alerts. |

---

## 🏛️ 3. Page Architecture & Routing Structure

The application is structured into **3 primary routes**:

### 1. 🏠 Main Landing Page (`src/routes/index.tsx` — `/`)
- **Purpose**: Fast, high-converting, uncluttered introduction to SecureLens.
- **Included Sections**:
  - `HeroSection`: Display headline, CTAs, 3D Canvas, and Dashboard Showcase.
  - `TechMarquee`: Infinite horizontal tech stack ticker.
  - `FeaturesSection`: 3 Core Security Pillars (AST Engine, RAG, Gemini AI).
  - `StatsSection`: Animated rolling benchmark counter cards.
  - `ArchitectureSection`: 5-Stage security pipeline walkthrough.
  - `ShowcaseSection`, `ProblemSection`, `TechSection`, `LandingFooter`.

### 2. 🚀 Interactive Capabilities Suite (`src/routes/features.tsx` — `/features`)
- **Purpose**: Dedicated interactive sandbox page for testing features without cluttering the main homepage.
- **Included Components**:
  - `MicroAuditorSandbox`: Working mini code editor where visitors test live AST scans.
  - `VulnerabilityMatrix`: 3D threat cards for SQLi, Command Injection, Traversal, and Deserialization.
  - `PdfReportShowcase`: Interactive preview of downloadable security PDF reports.
  - `CliTerminal`: macOS CLI terminal window showing terminal commands & CI/CD workflow output.

### 3. 🖥️ Security Auditor Dashboard (`src/routes/app.tsx` — `/app`)
- **Purpose**: Full-featured security review workspace.
- **Layout**: Fixed `h-screen` viewport split into a 45% Left Panel (Editor & Controls) and 55% Right Panel (Pipeline Loader & Security Findings).

---

## ⚡ 4. Detailed Animation Engineering & Motion Systems

### A. Native 3D WebGL / HTML5 Canvas Engine (`ThreeDHeroCanvas.tsx`)
Rather than relying on heavy external 3D bundle dependencies, SecureLens uses a custom 100% native HTML5 3D Perspective Projection Engine.

#### Mathematical Principle of 3D Projection:
3D points $(x, y, z)$ are rotated in 3D space using trigonometric rotation matrices:

$$\text{Rotate Y: } x_1 = x \cos(\theta_y) - z \sin(\theta_y), \quad z_1 = x \sin(\theta_y) + z \cos(\theta_y)$$
$$\text{Rotate X: } y_2 = y \cos(\theta_x) - z_1 \sin(\theta_x), \quad z_2 = y \sin(\theta_x) + z_1 \cos(\theta_x)$$

The 3D coordinates are then projected onto the 2D Screen $(s_x, s_y)$ using perspective depth scaling:

$$\text{Scale Factor: } \text{dist} = \frac{\text{fov}}{\text{fov} + z_2 + 450}$$
$$s_x = \frac{\text{width}}{2} + x_1 \cdot \text{dist}, \quad s_y = \frac{\text{height}}{2} + y_2 \cdot \text{dist}$$

#### Key 3D Visual Elements:
1. **3D Octahedron Shield Core**: Translucent wireframe edges with glowing vertex spheres (`#ffffff` & `#ffb829`).
2. **Dual Concentric Orbital Rings**: Torus rings rotating on intersecting axes representing RAG and Policy layers.
3. **Floating Particle Synapses**: 90 floating nodes connecting with glowing line segments when proximity is under $140\text{px}$.
4. **Scroll & Cursor Physics**: Dynamic rotation lerp driven by `window.scrollY` and mouse coordinates.

---

### B. Re-triggering Scroll Entrance Animations (`viewport={{ once: false }}`)
To ensure animations re-trigger seamlessly whether scrolling **DOWN or back UP**, components use Framer Motion's `whileInView` with `viewport={{ once: false, amount: 0.2 }}`:

```tsx
const EASING = [0.22, 1, 0.36, 1]; // Custom cubic-bezier

<motion.div
  initial={{ opacity: 0, x: -70 }} // Slides in from left
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: false, amount: 0.2 }} // Re-triggers continuously
  transition={{ duration: 0.8, ease: EASING }}
>
  {children}
</motion.div>
```

Alternating items flip the initial direction (`x: -70` for left items, `x: 70` for right items) to create a rhythmic, alternating entrance effect.

---

### C. 3D Parallax Tilt Cards & Ambient Cursor Spotlights
Cards in `HeroSection` and `FeaturesSection` feature 3D tilt tracking:
- Mouse position relative to the card dimensions calculates `rotateX` and `rotateY` degrees.
- A dynamic `radial-gradient` background spotlight tracks `(x%, y%)` cursor coordinates inside the card container.

```tsx
const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  setTilt({
    rx: y * -14, // Tilt X
    ry: x * 14,  // Tilt Y
    spotX: ((e.clientX - rect.left) / rect.width) * 100,
    spotY: ((e.clientY - rect.top) / rect.height) * 100,
  });
};
```

---

### D. Infinite Tech Stack Marquee Ticker (`TechMarquee.tsx`)
Achieved via an infinite CSS translate animation over a triplicated array of badges:
```tsx
<motion.div
  animate={{ x: ["0%", "-33.333%"] }}
  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
>
  {marqueeItems.map(...)}
</motion.div>
```
Left and right edges use `linear-gradient` masks (`rgba(0,0,0,1)` to `transparent`) to create smooth fade-out boundaries.

---

### E. Animated Rolling Counter Stat Cards (`StatsSection.tsx`)
Number counters interpolate smoothly from 0 to target values using Framer Motion's `useMotionValue` and `animate()` combined with `useInView`:

```tsx
useEffect(() => {
  if (isInView) {
    const controls = animate(count, target, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }
}, [isInView, target]);
```

---

## 🔒 5. SSR Safety & Performance Optimizations

1. **Hydration Guards**: Components with browser API access (`window`, `canvas`, `document`) are guarded behind a `mounted` state check (`useEffect(() => setMounted(true), [])`) to prevent SSR hydration mismatches.
2. **Animation Frame Cleanup**: Every `requestAnimationFrame` loop in 3D canvas components explicitly cancels its frame ID during unmount (`cancelAnimationFrame(id)`) to eliminate memory leaks.
3. **Fixed Viewport Dashboard Layout**: In `/app`, the left and right panels are locked to `h-screen flex-col overflow-hidden` to prevent layout jumps or button shifts when scanning results load.
