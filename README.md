# Cognito 🧠

<p align="center">
  <img src="cognito_banner.png" alt="Cognito Banner" width="800">
</p>

Cognito is an elite AI-powered study companion designed to transform the learning experience. By combining conversational intelligence, data-driven performance analysis, and automated video processing, Cognito provides students with a unified mission control for academic success. 🚀

## 🎨 Design Philosophy

The application utilizes a **Premium Solarpunk Dark** aesthetic:
* 🌑 **Surfaces**: Deep Charcoal and Zinc with Glassmorphism effects
* 🔮 **Accents**: Luminous Indigo-to-Orchid gradients
* 🪟 **Visuals**: Translucent glass-card layers with backdrop-blur (40px)
* 🌊 **Animations**: Framer Motion powered transitions and micro-interactions
* 📐 **Typography**: Modern Inter typeface for maximum readability

## 📈 System Implementation Status

### ✅ Completed Phases
* 🏗️ **Phase 1: Foundation** - Migration to a modern React + Vite + Tailwind CSS architecture.
* 🔐 **Phase 2: Authentication** - Full Auth0 integration with protected routes and user profile management.
* 💬 **Phase 3: Intelligence** - Llama 3.3 powered chat with session context, Markdown rendering, and Export-to-Markdown.
* 📊 **Phase 4: Analysis Engine** - Multer-based CSV performance analyzer with persistence and cross-tool navigation.
* 🎥 **Phase 5: Video Suite** - Automated YouTube discovery and Gemini 1.5 Pro powered summarization.
* 🌓 **Phase 6: Personalization** - Dark/Light theme engine with persistent state and collapsible sidebar.
* 📱 **Phase 7: Accessibility** - Mobile-responsive layout, ARIA-optimized components, and keyboard shortcuts.

## ✨ Current Features

* 💬 **AI Chat Tutor**: Conversational assistant with memory, Socratic questioning, and Markdown support.
* 📊 **Performance Analyzer**: Upload CSV test results to identify weak topics. Now with "Recommend Videos" deep-linking.
* 🎥 **Video Recommender**: Discovery Grid for YouTube content based on identified weak topics or manual search.
* 📝 **Video Summarizer**: Extract key concepts and core insights from long lectures in seconds.
* 💾 **Persistent State**: All your messages, analysis results, and summaries stay saved in your browser.
* 🌗 **Theme Toggle**: Switch between the signature Dark mode and a high-fidelity Light mode.
* ⌨️ **Power User Shortcuts**: `Ctrl+1-4` for navigation, `Ctrl+N` for new chat, and more.

## ⚙️ Technical Architecture

### 💻 Tech Stack
* **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Auth0
* **Backend**: Node.js, Express, Multer
* **AI Engines**: Together.ai (Llama 3.3), Google Gemini 1.5 Pro
* **Analysis**: Python 3 (Pandas, Scikit-learn)

### 📊 API Interface
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/chat` | `POST` | AI chat with session history context |
| `/api/analyze/upload` | `POST` | Multer-based CSV processing for performance analysis |
| `/api/recommend` | `POST` | YouTube video discovery engine |
| `/api/summarize` | `POST` | Gemini-powered video summarization |

## 🚀 Local Development

1. **Clone the repository and install dependencies**:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in `frontend/` and `backend/`.
   - **Frontend**: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_API_BASE_URL`
   - **Backend**: `TOGETHER_API_KEY`, `GOOGLE_API_KEY`, `YOUTUBE_API_KEY`

3. **Start the application**:
   ```bash
   # Terminal 1 (Backend)
   npm start

   # Terminal 2 (Frontend)
   npm run dev
   ```

4. **Access the App**:
   Navigate to `http://localhost:5173`.
