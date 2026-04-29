import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, FileText, Video, Youtube,
  ArrowRight, Sparkles, Brain, BookOpen, Zap,
  BarChart3, Shield, Globe
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => loginWithRedirect();
  const handleSignup = () =>
    loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="w-10 h-10 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6 text-indigo-400" />,
      title: 'AI Chat Tutor',
      description: 'Have real conversations with an AI that understands your curriculum and adapts explanations to your level.',
      gradient: 'from-indigo-500/20 to-blue-500/20',
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-400" />,
      title: 'Performance Analyzer',
      description: 'Upload your test results and get instant analysis pinpointing your weakest topics with study guidance.',
      gradient: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      icon: <Video className="w-6 h-6 text-purple-400" />,
      title: 'Video Recommender',
      description: 'Enter any topic and get curated YouTube video recommendations matched to your learning needs.',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <Youtube className="w-6 h-6 text-rose-400" />,
      title: 'Video Summarizer',
      description: 'Paste a YouTube link and receive a concise AI-generated summary. Study smarter, not longer.',
      gradient: 'from-rose-500/20 to-orange-500/20',
    },
  ];

  const stats = [
    { icon: <Zap className="w-5 h-5" />, value: '4', label: 'AI-Powered Tools' },
    { icon: <BarChart3 className="w-5 h-5" />, value: 'Instant', label: 'Analysis Results' },
    { icon: <Brain className="w-5 h-5" />, value: 'Smart', label: 'Personalized Learning' },
    { icon: <Shield className="w-5 h-5" />, value: 'Secure', label: 'Auth0 Protected' },
  ];

  return (
    <div className="landing-page bg-gray-900 text-white min-h-screen overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Cognito</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">About</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-all duration-200"
            >
              Log In
            </button>
            <button
              onClick={handleSignup}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-200 font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-[500px] h-[500px] bg-indigo-600/15 top-[-10%] left-[-10%]" />
        <div className="orb w-[400px] h-[400px] bg-purple-600/15 bottom-[-5%] right-[-5%]" style={{ animationDelay: '-5s' }} />
        <div className="orb w-[300px] h-[300px] bg-blue-600/10 top-[40%] right-[20%]" style={{ animationDelay: '-10s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-50" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="slide-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Study Companion</span>
          </div>

          <h1 className="slide-up slide-up-delay-1 text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Study Smarter with{' '}
            <span className="gradient-text">Cognito</span>
          </h1>

          <p className="slide-up slide-up-delay-2 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Analyze your weaknesses, chat with AI, summarize lectures, and discover the best learning resources -- all in one place.
          </p>

          <div className="slide-up slide-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSignup}
              className="group px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 hover:gap-3"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-all duration-200" />
            </button>
            <a
              href="#features"
              className="px-8 py-3.5 border border-gray-700 text-gray-300 rounded-xl font-medium hover:border-gray-500 hover:text-white transition-all duration-200 text-center"
            >
              See What's Inside
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Four powerful tools working together to transform how you study, review, and retain knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`slide-up slide-up-delay-${index + 1} glass-card rounded-2xl p-6 group hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────── */}
      <section id="about" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/30 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left column -- narrative */}
            <div>
              <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">About Cognito</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for Students Who Want to{' '}
                <span className="gradient-text">Learn Smarter</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Cognito is an AI-powered study companion designed for students who refuse to settle for passive learning. It combines conversational AI, data-driven performance analysis, and video intelligence into a single, unified platform.
                </p>
                <p>
                  Upload your test results and instantly discover which topics need attention. Ask the AI tutor to explain difficult concepts in plain language. Find the best YouTube videos on any subject and get summaries so you can review without re-watching.
                </p>
                <p>
                  No more switching between five different apps. No more guessing what to study next. Cognito gives you clarity, direction, and the tools to act on it.
                </p>
              </div>
            </div>

            {/* Right column -- stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-6 text-center group hover:border-indigo-500/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Studies?</h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Join Cognito and start studying with AI-powered tools designed to help you understand, retain, and excel.
              </p>
              <button
                onClick={handleSignup}
                className="group px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-all duration-200 inline-flex items-center gap-2 hover:gap-3"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 transition-all duration-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Cognito. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Features</a>
            <a href="#about" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">About</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
