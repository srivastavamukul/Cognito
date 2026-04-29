# Cognito -- Improvement Plan

> Full audit of every file, every route, every component, and the live running app.
> Organized by area, then by priority. Each item states the problem, the fix, and the files involved.

---

## Phase 1 -- Critical Fixes (do first)

### 1. Architecture and Configuration

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 1.1 | Backend URL `http://localhost:3030` is hardcoded in 4 components. Switching between local dev and production (Vercel) requires manually editing every file. | Create a single `frontend/src/config.ts` that exports `API_BASE_URL` from `import.meta.env.VITE_API_BASE_URL` with a fallback to `http://localhost:3030`. Import it in every component that makes API calls. Add `VITE_API_BASE_URL` to `frontend/.env`. | `frontend/src/config.ts` (new), `ChatInterface.tsx`, `FileAnalyzer.tsx`, `VideoRecommender.tsx`, `VideoSummarizer.tsx`, `frontend/.env` |
| 1.2 | Auth0 domain and clientId are hardcoded in `main.tsx`. If credentials change or you deploy to a new domain, you must edit source code. | Move both values into `frontend/.env` as `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`. Read them via `import.meta.env` in `main.tsx`. | `main.tsx`, `frontend/.env` |
| 1.3 | Backend `.env` is missing from the repo (created by us as a template). The `SECRET_KEY` env var name does not match what the `together-ai` SDK expects by default (`TOGETHER_API_KEY`). The `recommender_api.py` reads `YOUTUBE_API_KEY` but the backend Node process does not pass env vars to child Python processes. | Rename `SECRET_KEY` to `TOGETHER_API_KEY` in `.env`. In `index.js`, change `new Together({ apiKey: process.env.SECRET_KEY })` to `new Together()` (SDK auto-reads `TOGETHER_API_KEY`). For Python scripts, pass the full `process.env` to `spawn` via `{ env: process.env }` option. Add `GOOGLE_API_KEY` to `.env` for the summariser. | `backend/.env`, `backend/index.js` |
| 1.4 | Two duplicate Python scripts exist for both recommender and summariser (`videoRecommender.py` + `recommender_api.py`, `summariser.py` + `summarizer_api.py` + `videoSummariser.py`). The backend calls the `_api.py` versions. The standalone scripts are dead code that will confuse future contributors. | Delete `videoRecommender.py`, `summariser.py`, and `videoSummariser.py` (the standalone interactive scripts). Keep only the `_api.py` versions and `analyser.py`. Rename `analyser.py` to `analyzer.py` for consistency. Update the import inside `analyzer_api.py`. | `backend/videoRecommender.py` (delete), `backend/summariser.py` (delete), `backend/videoSummariser.py` (delete), `backend/analyser.py` (rename), `backend/analyzer_api.py` |

### 2. Backend Hardening

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 2.1 | `/api/recommend` endpoint has no `try/catch`. If the Python process outputs invalid JSON or crashes, `JSON.parse(out)` throws an unhandled exception and Express crashes the entire server. | Wrap the `py.on('close')` handler in try/catch. Return `500` with a descriptive error if parsing fails. Check the exit code. | `backend/index.js` (lines 85-96) |
| 2.2 | `/api/analyze` returns `500` even on successful runs if Python writes *anything* to stderr (e.g. deprecation warnings from pandas). The check `if (code !== 0 \|\| error)` is too aggressive. | Change the condition to only fail on non-zero exit code: `if (code !== 0)`. Log stderr as a warning but do not treat it as a fatal error. | `backend/index.js` (line 63) |
| 2.3 | No request validation or size limits. A user could POST a massive JSON body or spam the chat endpoint. | Add `express.json({ limit: '1mb' })`. Remove the redundant `bodyParser.json()` (Express 5 has `express.json()` built in). Add basic rate limiting with `express-rate-limit` (e.g. 30 requests per minute per IP). | `backend/index.js`, `backend/package.json` |
| 2.4 | CORS is configured twice: once via the `cors()` middleware and again via manual `res.header()` calls. Redundant and confusing. | Remove the manual `res.header()` middleware (lines 15-20). Keep `app.use(cors())`. For production, pass an origin whitelist to `cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] })`. | `backend/index.js` |
| 2.5 | No health check endpoint. Difficult to verify the backend is alive without hitting a real feature endpoint. | Add `app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }))`. | `backend/index.js` |
| 2.6 | `summarizer_api.py` imports from `videoSummariser.py` which uses HuggingFace BART locally. This downloads a ~1.6 GB model on first run and is extremely slow. The standalone `summariser.py` uses Google Gemini (much faster, no local model). The backend calls `summarizer_api.py` -> `videoSummariser.py` -> BART. This is the wrong chain. | Rewrite `summarizer_api.py` to use the Gemini approach directly (like `summariser.py` does). Remove the HuggingFace/BART dependency. This makes summarization 10-50x faster and removes the `torch` and `transformers` pip dependencies (~4 GB). Update `requirements.txt`. | `backend/summarizer_api.py`, `backend/requirements.txt` |

---

## Phase 2 -- UX and Frontend Overhaul

### 3. Global UX Issues

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 3.1 | Every page is an ocean of empty dark space. The content hugs the top-left and does nothing to fill or structure the viewport. On a 1440p or 4K monitor, the app looks abandoned. | Add a centered `max-w-4xl mx-auto` container inside `MainContent.tsx` for the non-chat views. For chat, keep full height but add a `max-w-3xl mx-auto` to the message area so messages do not stretch edge to edge. | `MainContent.tsx`, `ChatInterface.tsx` |
| 3.2 | No empty state illustrations or onboarding hints. When a user opens Video Recommender or Summarizer for the first time, they see a search bar and then nothing. Zero guidance on what to do. | Add an empty state component for each tool. Show a subtle icon, a short sentence explaining what the tool does, and an example input (e.g. "Try: machine learning fundamentals"). | `VideoRecommender.tsx`, `VideoSummarizer.tsx`, `FileAnalyzer.tsx` |
| 3.3 | No toast/snackbar system for success or error feedback. Errors are either silently logged to console or shown as inline text that is easy to miss. | Add a lightweight toast system (a `ToastContext` with auto-dismiss). Show toasts for: file upload success, analysis complete, API errors, invalid URL. Use green for success, red for error, amber for warning. | `frontend/src/context/ToastContext.tsx` (new), `frontend/src/components/Toast.tsx` (new), integrate into `App.tsx` |
| 3.4 | The Login button in the sidebar has zero styling. It is raw unstyled text ("Log In" / "Log Out") that looks broken. The "L" avatar circle beside it is meaningless (does not show the user's initial or photo after login). | Style the Login button with the same `px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700` pattern. After login, show the Auth0 user's avatar image (or first initial) instead of "L". Show the user's name/email below. | `Login.tsx`, `Sidebar.tsx` |
| 3.5 | The "Student Assistant" AI persona section at the bottom of the sidebar serves no purpose. It is static text that wastes vertical space. | Remove it entirely, or repurpose it as a collapsible "About" tooltip. Reclaim the space for the user profile section. | `Sidebar.tsx` |
| 3.6 | The sidebar has no visual divider or breathing room between the navigation items and the bottom sections. The nav items and auth section feel crammed together. | Add a `mt-auto` to the bottom section so it pins to the bottom naturally. Add a subtle 1px gradient divider above it. | `Sidebar.tsx` |
| 3.7 | Page transitions are instant (hard swap). Switching tools feels jarring. | Add a fade/slide transition when switching `activeTool`. Can be done with a CSS transition wrapper or a simple `animate-fadeIn` on the `MainContent` render, keyed on `activeTool`. | `MainContent.tsx` |
| 3.8 | No mobile responsiveness at all. The sidebar is a fixed `w-64` that will completely break on any screen under 768px. | Add a hamburger menu button (visible on `md:hidden`). Hide the sidebar by default on mobile and show it as an overlay drawer. Add `md:flex` to the main layout. | `App.tsx`, `Sidebar.tsx`, `MainContent.tsx` |

### 4. Chat Improvements

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 4.1 | Chat has no conversation history or context. Every message is sent in isolation (`messages: [{ role: 'user', content: message }]`). The AI has zero memory of previous messages in the same session. | Send the entire `messages` array (or the last N messages) to the backend. On the backend, forward the full conversation array to Together.ai. | `ChatInterface.tsx`, `backend/index.js` (line 128-139) |
| 4.2 | AI responses are rendered as raw text with `whitespace-pre-wrap`. The AI model (Llama 3) returns Markdown (headers, lists, code blocks, bold), but none of it is rendered. | Install `react-markdown` and `remark-gfm`. Render the assistant message content inside a `<ReactMarkdown>` component wrapped in the `.markdown` CSS class (which already exists in `index.css`). | `MessageBubble.tsx`, `frontend/package.json` |
| 4.3 | No system prompt. The AI has no instructions about its role, tone, or the fact that it is a student assistant. It behaves as a generic chatbot. | Add a system message at the beginning of the messages array sent to Together.ai: `{ role: 'system', content: 'You are Cognito, an AI study assistant...' }`. Define the system prompt in a config constant. | `backend/index.js` |
| 4.4 | No way to clear chat or start a new conversation. Messages accumulate forever in the session. | Add a "New Chat" button in the chat header area (or sidebar). When clicked, reset the `messages` array to just the welcome message. | `ChatInterface.tsx`, `AppContext.tsx` |
| 4.5 | The chat input is a single-row textarea. For longer messages, the user cannot see what they are typing. | Set `rows={1}` but add `max-rows` behavior: auto-expand the textarea height up to 5 lines based on content. Use a `useRef` with `scrollHeight` measurement. | `ChatInterface.tsx` |

### 5. File Analyzer Fixes

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 5.1 | No file type restriction. The analyzer only works on CSVs (the Python script reads CSV), but the upload zone accepts any file. A user could upload a PDF or image and get a cryptic backend error. | Add `accept=".csv"` to the hidden `<input type="file">`. Show a warning toast if a non-CSV file is dropped. | `FileAnalyzer.tsx` |
| 5.2 | The analysis results only show "Weak Topics: topic1, topic2" as a comma-separated string. No visualization, no context, no actionable insight. | Display results as styled cards/chips: each weak topic as a tag with an icon. Add a "Recommend Videos" button next to each topic that auto-navigates to Video Recommender with the topic pre-filled. | `FileAnalyzer.tsx`, `AppContext.tsx` (add a `setActiveTool` + `prefillTopic` flow) |
| 5.3 | The Cloudinary upload is a third-party dependency that requires the user to set up a Cloudinary account, a cloud name, and an upload preset. For a local-first app this is unnecessary overhead. The backend could simply accept the file directly. | Add a `multer` upload route to the backend (`POST /api/analyze/upload`). Accept the CSV file directly, save to a temp directory, run the Python script on the local file path, delete after analysis. Remove the Cloudinary dependency from the frontend. This makes the app work out of the box with zero third-party configuration. | `backend/index.js` (new route), `FileAnalyzer.tsx` (replace Cloudinary upload with direct upload) |

### 6. Video Recommender Fixes

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 6.1 | The heading `<h2>` is empty (`<h2 className="..."></h2>`). There is no page title. | Set the text to "Video Recommender". | `VideoRecommender.tsx` (line 38) |
| 6.2 | The video card has a nested `<button>` inside an `<a>` tag. This is invalid HTML and causes double-navigation. The button `onClick` opens the same URL that the wrapping `<a>` already links to. | Remove the inner `<button>`. Keep only the `<a>` tag. Display a cleaner link label like "Watch on YouTube" instead of dumping the raw URL. | `VideoRecommender.tsx` (lines 101-116) |
| 6.3 | The `video.id` used as a React `key` does not exist on the recommendation objects returned by the backend. The backend returns `{ topic, subtopic, videos }` with no `id` field. React will silently use `undefined` as the key, causing render bugs. | Use the array index as key, or better, generate a key from `topic + subtopic`. Also update the `VideoRecommendation` type to match the actual API response shape (`topic`, `subtopic`, `videos[]`). | `VideoRecommender.tsx`, `types/index.ts` |
| 6.4 | Results show the `video.title` and `video.description` from the recommendation object, but the backend response shape is `{ topic, subtopic, videos: [{ title, url, thumbnail, description }] }`. The component accesses `video.title` but `video` is actually the top-level recommendation (which has `topic`/`subtopic`, not `title`/`description`). The displayed data is wrong. | Fix the component to display `rec.topic` and `rec.subtopic` as the card header, then iterate `rec.videos` as a sub-list with each video's `title`, `thumbnail`, and `url`. | `VideoRecommender.tsx` |
| 6.5 | `recommender_api.py` requires `scikit-learn` and `google-api-python-client`, but neither is in `requirements.txt`. First run will crash with `ModuleNotFoundError`. | Add `scikit-learn`, `google-api-python-client`, `pandas`, and `requests` to `requirements.txt`. | `backend/requirements.txt` |

### 7. Video Summarizer Fixes

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 7.1 | The `videoTitle` passed to `addVideoSummary` is `getYoutubeVideoId(videoUrl)!` -- it passes the video ID (e.g. `dQw4w9WgXcQ`) as the title. The UI then shows the video ID as the title, which is meaningless to the user. | Fetch the actual video title from the backend. Modify the `/api/summarize` endpoint to also return the video title (extracted from the transcript API or a simple YouTube oEmbed call). | `VideoSummarizer.tsx`, `backend/index.js`, `backend/summarizer_api.py` |
| 7.2 | Summarization uses HuggingFace BART locally (per item 2.6). On machines without a GPU this takes 5+ minutes for a single video. The user gets no progress feedback -- just a spinner. | (Covered in 2.6 -- switch to Gemini.) Additionally, add a progress message like "This may take 30-60 seconds..." below the spinner. | `VideoSummarizer.tsx` |
| 7.3 | The YouTube URL validation regex is too loose. `youtube.com/channel/...` would pass validation but is not a video URL. | Tighten the regex to require `/watch?v=` or `youtu.be/` patterns specifically. | `VideoSummarizer.tsx` |

---

## Phase 3 -- Polish and New Features

### 8. New Features

| # | Feature | Description | Files |
|---|---------|-------------|-------|
| 8.1 | **Dark/Light theme toggle** | Add a theme toggle button in the sidebar header. Use CSS variables for all colors. Swap between a dark palette (current) and a light palette. Store preference in `localStorage`. | `index.css`, `tailwind.config.js`, `AppContext.tsx`, `Sidebar.tsx` |
| 8.2 | **Chat export** | Add a "Download Chat" button that exports the current conversation as a `.txt` or `.md` file. Useful for students reviewing AI explanations later. | `ChatInterface.tsx` |
| 8.3 | **Keyboard shortcuts** | `Ctrl+1/2/3/4` to switch between tools. `Ctrl+N` for new chat. `Escape` to close mobile sidebar. | `App.tsx` (global `useEffect` keydown listener) |
| 8.4 | **Drag-to-resize sidebar** | Let the user drag the sidebar edge to resize it, or collapse it entirely with a toggle button. | `App.tsx`, `Sidebar.tsx` |
| 8.5 | **Persistent state** | Save chat messages, analysis results, and summaries to `localStorage` so they survive page refreshes. | `AppContext.tsx` |

### 9. SEO and Accessibility

| # | Problem | Fix | Files |
|---|---------|-----|-------|
| 9.1 | `index.html` has no meta description, no Open Graph tags, no favicon (points to default `vite.svg`). | Add proper `<meta name="description">`, OG tags, and a custom favicon. | `frontend/index.html` |
| 9.2 | No `aria-label` attributes on interactive elements. Screen readers cannot navigate the app. | Add `aria-label` to all buttons, inputs, and navigation items. Add `role="navigation"` to the sidebar, `role="main"` to the content area. | All component files |
| 9.3 | No keyboard navigation. The sidebar items are `<div>` elements with `onClick` -- they cannot be focused or activated via keyboard. | Change sidebar items to `<button>` elements (or add `tabIndex={0}` and `onKeyDown` for Enter/Space). | `Sidebar.tsx` |

---

## Implementation Order

```
Phase 1 (Foundation):
  1.1 -> 1.3 -> 1.4 -> 2.1 -> 2.2 -> 2.3 -> 2.4 -> 2.5 -> 2.6 -> 1.2

Phase 2 (UX):
  3.1 -> 3.8 -> 3.2 -> 3.3 -> 3.4 -> 3.5 -> 3.6 -> 3.7
  4.1 -> 4.2 -> 4.3 -> 4.4 -> 4.5
  5.3 -> 5.1 -> 5.2
  6.1 -> 6.3 -> 6.4 -> 6.5 -> 6.2
  7.1 -> 7.2 -> 7.3

Phase 3 (Polish):
  8.5 -> 8.1 -> 8.2 -> 8.3 -> 8.4
  9.1 -> 9.2 -> 9.3
```

> [!IMPORTANT]
> Items 1.3 (env var fix), 2.6 (switch summarizer from BART to Gemini), 5.3 (remove Cloudinary dependency), and 6.5 (missing pip deps) are **blockers** -- the app will crash or fail silently without them in a fresh environment.
