# Cognito - Application Design & Technical Requirements

This document outlines the precise design, state management, and API integration requirements for the Cognito (Student Assistant) application. It must be maintained exactly.

## 1. Global Layout & Theme Configuration
- **Application Type:** Multi-Page Web Application (MPA feel via React Router).
- **Framework:** React + Vite, Tailwind CSS.
- **Icons:** `lucide-react`.
- **Typography:** `Inter` (Google Fonts), fallback `system-ui`.
- **Global Theme (Dark Mode):**
  - App Background: `bg-gray-900` (#0F1117)
  - Card Background: `bg-gray-800`
  - Accent Gradient: `from-indigo-500 to-purple-600`
  - Primary Button: `bg-indigo-600` (Hover: `bg-indigo-500`, Shadow: `shadow-indigo-600/20`)
- **Animations:** 
  - `.animate-fadeIn`: 0.3s, Y: 8px -> 0, Opacity: 0 -> 1.
  - `.slide-up`: 0.7s entrance for landing sections.
  - `.pulse-ring`: 3s infinite scale/opacity for empty state icons.

## 2. Routing & Authentication
- **Routes:**
  - `/`: **Landing Page** (Public).
  - `/dashboard`: **Main App** (Protected via `ProtectedRoute.tsx`).
- **Authentication:**
  - **Provider:** Auth0.
  - **Guard:** `ProtectedRoute` redirects unauthenticated users to `/`.
  - **Redirect:** Post-login sends users to `/dashboard`.

## 3. Landing Page Design (`LandingPage.tsx`)
A high-fidelity entrance designed to "WOW" users:
- **Navbar:** Sticky, `backdrop-blur-xl`, border-b `white/0.06`. Contains Logo, nav links (Features, About), and Login/Signup buttons.
- **Hero Section:**
  - Background: 3-4 animated "floating orbs" (blurred gradients) + `grid-pattern` overlay.
  - Text: `gradient-text` (Indigo/Purple/Pink shift) for main brand.
  - CTA: "Get Started Free" (Indigo) + "See What's Inside" (Outline).
- **Features Grid:** 4 cards using `glass-card` style (translucent background, blur, subtle border). Each card features a unique gradient-icon combo.
- **About Section:** Narrative on the left, 4 numerical "Stat Cards" on the right.
- **CTA Section:** Large `glass-card` banner with a central call-to-action button.

## 4. Core Dashboard Structure
The dashboard (Main Content + Sidebar) is active on `/dashboard`:
1. **Sidebar:** Fixed `w-64` (Drawer on mobile). Handles navigation between tools.
2. **Main Content:** Occupies remaining space. Centered `max-w-4xl` for tools, full-width with `max-w-3xl` message area for Chat.

## 5. Global State (`AppContext.tsx`)
Tracks session state:
- `activeTool`: Current view inside dashboard.
- `messages`: Full conversation history (includes welcome message).
- `clearMessages()`: Resets chat to welcome state.
- `isTyping`: Chat loading state.
- `analysisResults`: History of CSV analyses.
- `videoSummaries`: History of video summaries with titles/thumbnails.

---

## 6. Component Level Requirements

### A. Sidebar Component (`Sidebar.tsx`)
- **Navigation:** Chat, File Analyzer, Video Recommender, Video Summarizer.
- **User Profile (Bottom):** Shows Auth0 avatar image, User Name, Email, and a `LogOut` icon button.
- **Mobile Support:** Hidden by default on small screens, activated via hamburger menu as an overlay.

### B. Chat Interface (`ChatInterface.tsx`)
- **Logic:** Sends full conversation history (last 20 messages) to backend for context.
- **System Prompt:** "You are Cognito, an AI study assistant..."
- **Markdown:** AI responses rendered via `react-markdown` with `remark-gfm`. Supports headers, lists, bold, tables, and code blocks.
- **UI:** 
  - "New Chat" button in header.
  - Auto-expanding textarea (max 160px height).
  - Typing indicator: bouncing dots in a bubble.

### C. File Analyzer (`FileAnalyzer.tsx`)
- **Input:** Drag & drop zone restricted to `.csv` files.
- **Validation:** Shows red error message if invalid file type is dropped.
- **Results:** Shows "Weak Topics" extracted from the student data CSV.

### D. Video Recommender (`VideoRecommender.tsx`)
- **Input:** Search bar with suggestions (e.g., "Try: neural networks").
- **Results:** Nested card structure: Grouped by `subtopic`, each containing a list of videos with thumbnails, titles, and descriptions.
- **Link:** External link to YouTube (valid HTML `<a>` wrapper).

### E. Video Summarizer (`VideoSummarizer.tsx`)
- **Logic:** Validates YouTube URL pattern (`/watch?v=` or `youtu.be/`).
- **UI:** Shows "Generating Summary..." progress hint (30-60s notice).
- **Display:** Fetches video title from backend; renders summary using Markdown.

---

## 7. Technical Integrations
- **API Base:** `config.ts` exports `API_BASE_URL` (Env: `VITE_API_BASE_URL`).
- **Auth0:** Domain `dev-q42vneml3qho4xpf.us.auth0.com`, ClientID `0cUXfIspLNeFB1n7ChCwemjzdLo9jXSI`.
- **Backend:** Node.js server (`:3030`) proxying to Python AI scripts.
