# Changelog

- Project moved to `C:\Cognito`.
- Dependencies checked (Node modules present, Python pip install pending workspace update).
- Created `design.md` with full UI/UX and API specs.
- Created `primary.md`, `memory.md`, `change.log.md` for project tracking.
- Connected frontend to local backend (`http://localhost:3030`).
- Built frontend (`npm run build`).
- Created `.env` templates for backend and frontend.

## v0.2.0 -- Full Feature Update

### Added
- **Landing page** with hero section, animated gradient orbs, features grid, about section, CTA, and footer.
- **Login/Signup system** using Auth0: login and signup buttons on landing page navbar, protected dashboard route.
- **About section** on landing page explaining what Cognito is, who it is for, and stat cards.
- **Route protection** via `ProtectedRoute.tsx`. Unauthenticated users are redirected to landing page.
- **User profile** in sidebar: shows Auth0 avatar, name, email, and logout button.
- **Chat conversation context**: AI now remembers previous messages in the session (last 20).
- **System prompt**: AI has a defined persona ("Cognito, an AI study assistant").
- **Markdown rendering** in chat: AI responses render headers, bold, lists, code blocks, tables.
- **New Chat button** to clear conversation and start fresh.
- **Auto-expanding textarea** in chat input.
- **Empty states** for File Analyzer, Video Recommender, and Video Summarizer with descriptions and example suggestions.
- **Page transitions** (fade animation when switching tools).
- **Mobile sidebar** with hamburger menu and overlay drawer.
- **Centralized API config** (`config.ts` with `API_BASE_URL`).
- **SEO meta tags** in `index.html` (description, OG tags, Inter font from Google Fonts).
- **Health check endpoint** (`GET /health`) on backend.

### Fixed
- Backend env var mismatch (`SECRET_KEY` renamed to `TOGETHER_API_KEY`).
- Python child processes now inherit env vars (YouTube API key, Google API key visible to scripts).
- Video Recommender: fixed empty heading, fixed nested button inside anchor (invalid HTML), fixed data mapping to match actual API response shape.
- Video Summarizer: tightened YouTube URL validation regex.
- File Analyzer: restricted uploads to CSV only, added validation error message.
- Backend CORS: removed duplicate manual headers, configured proper origin whitelist.
- Backend: stderr from Python scripts treated as warnings, not fatal errors.
- Removed redundant `bodyParser.json()` (Express 5 has it built in).

### Removed
- Removed `Login.tsx` (auth now handled by landing page and sidebar).
- Removed static "Student Assistant" AI persona section from sidebar bottom.
