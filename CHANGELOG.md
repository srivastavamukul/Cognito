# Changelog

## [1.0.0] -- Production Release (2026-04-29)

### Added
- **Theme Engine**: Complete Dark/Light mode support using CSS custom variables and persistent `localStorage` state.
- **Collapsible Sidebar**: New icon-only state for a distraction-free "Focus Mode" workspace.
- **Persistent State**: Full `localStorage` integration for all tools (Chat history, Analysis results, Video Recommendations, and Summaries).
- **Chat Export**: Capability to download entire conversations as Markdown (.md) files for study review.
- **Keyboard Shortcuts**: Power user controls (`Ctrl+1-4` for tool switching, `Ctrl+N` for new chat, `Esc` for mobile drawer).
- **Actionable Insights**: "Recommend Videos" button in File Analyzer that deep-links to the Video Recommender with pre-filled topics.
- **Enhanced Summarization**: Gemini-powered summarizer now fetches actual YouTube video titles via oEmbed for better organization.
- **Accessibility (A11y)**: Full ARIA coverage with descriptive labels on all inputs and buttons.
- **SEO/Branding**: Custom SVG favicon, apple-touch-icon, and OpenGraph/Twitter social sharing metadata.

### Changed
- **Performance Engine**: Replaced slow local BART summarization with high-speed **Google Gemini 1.5 Pro** API.
- **Data Pipeline**: Removed Cloudinary dependency; switched to direct local `multer` uploads for CSV analysis.
- **Backend Hardening**: Added `express-rate-limit` (30 req/min) and request body size limits (2MB).
- **UX Refinement**: Implemented centered, max-width containers and fade-in transitions between all tools.
- **Type Safety**: Centralized all TypeScript interfaces in `frontend/src/types/index.ts`.

---

## [0.2.0] -- Feature Implementation

### Added
- **Landing page** with hero section, animated gradient orbs, features grid, about section, CTA, and footer.
- **Login/Signup system** using Auth0 integration and protected dashboard routes.
- **User profile** in sidebar: shows Auth0 avatar, name, and email.
- **Chat conversation context**: AI now remembers previous messages in the session (last 20).
- **Markdown rendering** in chat: AI responses render headers, bold, lists, code blocks, tables.
- **Empty states** for all tools with descriptions and example suggestions.
- **Mobile responsiveness**: Hamburger menu and overlay drawer for smaller screens.
- **Health check endpoint** (`GET /health`) on backend.

### Fixed
- Backend env var mismatch (`SECRET_KEY` renamed to `TOGETHER_API_KEY`).
- Video Recommender: fixed invalid HTML (nested button) and fixed data mapping.
- Python child processes now correctly inherit environment variables.
- Tightened YouTube URL validation regex.

### Removed
- Removed static "Student Assistant" AI persona section from sidebar bottom.
