# Primary
Project: Cognito (Student Assistant).
Frontend: React, Vite, Tailwind CSS, React Router, Auth0.
Backend: Node.js, Express, Python.

Features:
- **Landing Page**: High-fidelity entrance with hero, features, about, and CTA.
- **Chat**: AI Study Tutor (Llama 3.3) with session memory and Markdown support.
- **File Analyzer**: Student performance analysis (CSV only) with topic extraction.
- **Video Recommender**: Topic-based YouTube suggestions with subtopic breakdown.
- **Video Summarizer**: YouTube transcript extraction and AI-generated summaries.

Architecture:
- **Routing**: `react-router-dom` with public `/` and protected `/dashboard`.
- **Auth**: Auth0 integration for login/signup and profile management.
- **API**: Centralized config (`API_BASE_URL`) pointing to local backend (`:3030`) with env fallbacks.
- **Backend**: Express server spawning Python scripts (`analyzer_api.py`, `recommender_api.py`, `summarizer_api.py`).
- **Data Flow**: Child processes inherit environment variables for API keys (YouTube, Gemini, Together).
