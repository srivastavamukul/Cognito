# Cognito 🧠

<p align="center">
  <img src="cognito_banner.png" alt="Cognito Banner" width="800">
</p>

Cognito is an elite AI-powered study companion designed to transform the learning experience. By combining conversational intelligence, data-driven performance analysis, and automated video processing, Cognito provides students with a unified mission control for academic success. 🚀

## 🎨 Design Philosophy

The application utilizes a **Premium Dark** and **Glassmorphism** aesthetic:
* 🌑 **Surfaces**: Deep Charcoal (#0F1117)
* 🔮 **Accents**: Luminous Indigo-to-Purple gradients
* 🪟 **Visuals**: Translucent glass-card layers with backdrop-blur
* 🌊 **Animations**: Smooth slide-ups and floating gradient orbs
* 📐 **Typography**: Modern Inter typeface for maximum readability

## 📈 System Implementation Status

### ✅ Completed Phases
* 🏗️ **Phase 1: Foundation** - Migration to a modern React + Vite + Tailwind CSS architecture.
* 🔐 **Phase 2: Authentication** - Full Auth0 integration with protected routes and user profile management.
* 💬 **Phase 3: Intelligence** - Llama 3.3 powered chat with session context and Markdown rendering.
* 📊 **Phase 4: Analysis Engine** - CSV-based performance analyzer using Python for topic extraction.
* 🎥 **Phase 5: Video Suite** - Automated YouTube recommendation and summarization pipelines.
* 📱 **Phase 6: Accessibility** - Mobile-responsive layout with drawer navigation and accessibility optimizations.

## ✨ Current Features

* 💬 **AI Chat Tutor**: Conversational assistant with memory of previous messages. Supports code blocks, tables, and formatted explanations.
* 📊 **Performance Analyzer**: Upload CSV test results to identify weak topics and receive study guidance.
* 🎥 **Video Recommender**: Intelligent YouTube discovery based on specific learning topics and subtopics.
* 📝 **Video Summarizer**: AI-generated lecture summaries from YouTube URLs to save study time.
* 🌍 **Landing Page**: Professional entrance with animated sections and comprehensive onboarding.
* 🔒 **Secure Auth**: Industry-standard login/signup and profile persistence via Auth0.

## 📅 Future Development Roadmap

### 🚀 Immediate Objectives
* 💾 **Local Persistence**: Save chat history and analysis results to localStorage for session persistence.
* 📤 **Study Export**: Capability to download AI explanations and video summaries as PDF/Markdown.
* 🌗 **Theme Engine**: Toggle between the current dark mode and a high-fidelity light theme.

### 🔭 Long Term Vision
* 📅 **Study Scheduler**: Automated calendar generation based on identified weak topics.
* 🤝 **Collaborative Study**: Shared workspaces for peer-to-peer learning and AI-moderated discussions.
* 📱 **Native Experience**: Dedicated mobile application using React Native with offline support.

## ⚙️ Technical Architecture

### 💻 Tech Stack
* **Frontend**: React 18, Vite, Tailwind CSS, React Router
* **Backend**: Node.js, Express
* **AI Engines**: Together.ai (Llama 3.3), Google Gemini 1.5 Pro
* **Auth**: Auth0
* **Analysis**: Python (Pandas, Scikit-learn)

### 📊 API Interface
Cognito utilizes a centralized backend proxy to manage AI and analysis tasks:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/chat` | `POST` | AI chat with session history context |
| `/api/analyze` | `POST` | CSV processing for performance analysis |
| `/api/recommend` | `POST` | YouTube video discovery engine |
| `/api/summarize` | `POST` | Transcript-based video summarization |

## 📁 Project Structure

* `/frontend`: The main React application (Vite, Tailwind, Auth0).
* `/backend`: Node.js Express server and Python AI scripts.
* `CHANGELOG.md`: Detailed history of every change and version update.

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
   Create a `.env` file in both `frontend` and `backend` directories based on the templates provided in the docs.

3. **Start the application**:
   ```bash
   # Terminal 1 (Backend)
   node index.js

   # Terminal 2 (Frontend)
   npm run dev
   ```

4. **Access the App**:
   Navigate to `http://localhost:5173` (or the port shown in your terminal).
