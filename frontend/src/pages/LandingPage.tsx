import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      <div className="h-screen w-screen flex items-center justify-center bg-[#0A0908]">
        <div className="w-10 h-10 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen relative">
      {/* Sticky Pill Navbar */}
      <header className="bg-zinc-950/60 backdrop-blur-[40px] sticky top-6 z-50 mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-5xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-center w-full px-6 py-3">
          <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-orchid-400 to-indigo-500 font-display-xl text-display-xl tracking-tight" style={{ fontSize: '1.5rem' }}>
            Cognito
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8">
              <a className="text-indigo-400 font-label-md text-label-md transition-all duration-300 hover:text-indigo-300" href="#home">Home</a>
              <a className="text-zinc-400 font-label-md text-label-md transition-all duration-300 hover:text-indigo-300" href="#features">Features</a>
              <a className="text-zinc-400 font-label-md text-label-md transition-all duration-300 hover:text-indigo-300" href="#about">About</a>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-indigo-400">
            <button
              onClick={handleLogin}
              className="text-zinc-400 font-label-md transition-all duration-300 hover:text-indigo-300"
            >
              Log In
            </button>
            <button
              onClick={handleSignup}
              className="transition-all duration-300 hover:text-indigo-300 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-7xl mx-auto px-container-padding flex flex-col gap-section-margin pt-16 pb-section-margin">
        {/* Hero Section (Bento Grid Style) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-element-gap items-center min-h-[716px]" id="home">
          {/* Hero Text */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="md:col-span-7 flex flex-col gap-6 z-10"
          >
            <h1 className="font-display-xl text-display-xl text-on-surface leading-tight">
              Elevate your study with <br/>
              <span className="luminescent-text">Cognito</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Your Solarpunk sanctuary for deep focus. AI-powered brainstorming, seamless file analysis, and intuitive video summaries in a distraction-free, floating environment.
            </p>
            <div className="mt-8 flex gap-4">
              <button onClick={handleSignup} className="luminescent-button px-8 py-4 rounded-full font-label-md text-label-md text-white flex items-center gap-2 hover:scale-[1.02]">
                Start Flow Session
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <a href="#features" className="glass-card px-8 py-4 rounded-full font-label-md text-label-md text-on-surface flex items-center gap-2 hover:scale-[1.02]">
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Hero Bento Visuals */}
          <div className="md:col-span-5 grid grid-cols-2 grid-rows-2 gap-4 h-[500px] relative">
            {/* Floating Orbs Background */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-container rounded-full mix-blend-screen filter blur-[60px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-10 -left-10 w-32 h-32 bg-secondary-container rounded-full mix-blend-screen filter blur-[50px] opacity-20"></div>

            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl row-span-2 col-span-1 p-6 flex flex-col justify-end overflow-hidden relative group"
            >
              <img alt="AI Brain" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsUxl2DQDlu776Awy35kyrUpm5GviIHxyWzWqhbw9HJd9KL80NprruP20ua1_-GmNU4fchUwzox3gkjVPIMv9giuz_pAGnHEKE0U1hUBPU8nntMSBtKcjAW6_pWa2XJiz9_rDjEnQXzjCiG44lZQMrmnb-sVTxFZ_gLrcM5lBaNGtnUWQLzoGRK_0ZVyet-WFCVodCJpAd5flvvqcu1ux5AO9bDCFVvWAM-Z2BLr5sxXNz0_zulq4-mTVrqWGEhD6fi2AJPTFnyL49"/>
              <div className="relative z-10 mt-auto">
                <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <h3 className="font-headline-md text-headline-md text-on-surface" style={{ fontSize: '1.25rem' }}>AI Brainstorm</h3>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl p-6 flex flex-col justify-center items-center text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-primary-fixed/30 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary text-3xl">timer</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">Focus Flow</span>
              <span className="font-headline-lg text-headline-lg text-primary">25:00</span>
            </motion.div>

            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl p-6 flex items-end relative overflow-hidden group"
            >
              <img alt="Data Flow" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6W4DVq3vHfd7Xod-LutcJ44ZnN79XlU1gw_y1-JHOWp1Ra0E51_2SRGynDS3yIgHtxnobyNBI7_NybDf-ZwA6MSrpfLR_A7wDhqLgz3-t5KdpuWUHzzKYQxZ9MgfOPNB1rtPSWUj2fKu5gLu8Uw-Dg8wm784fovO2SlTmdvJwvYpUFb9hABQpUuvkTkbTUMifleiAxdI7zGhNd0zxsGrh36uEtZmyCLjjPazHgHiSliG2YLu_qq5fh2X_feE9FTB27QzWeFRioKV0"/>
              <div className="relative z-10 w-full flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface">Library Sync</span>
                <span className="material-symbols-outlined text-secondary">sync</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="flex flex-col gap-12 mt-16" id="features">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Deep Learning Tools</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Intuitive, AI-driven features designed to reduce friction and amplify your understanding.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-element-gap">
            {/* Feature 1 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-primary/20"></div>
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2" style={{ fontSize: '1.5rem' }}>Socratic Chat</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Engage in dialogue that questions your assumptions and guides you to deeper comprehension.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-secondary/20"></div>
              <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2" style={{ fontSize: '1.5rem' }}>File Analyzer</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Upload PDFs or docs. Cognito extracts core concepts, definitions, and creates study guides instantly.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-tertiary/20"></div>
              <span className="material-symbols-outlined text-4xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2" style={{ fontSize: '1.5rem' }}>Video Summarizer</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Paste a lecture link. Get structured notes, key timestamps, and a tailored quiz in seconds.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-16" id="about">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          >
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Designed for Deep Focus</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
              Cognito was born from the need to escape the noise of modern digital environments. We built a sanctuary that combines cutting-edge AI with a calm, solarpunk aesthetic, allowing your mind to enter a state of flow seamlessly.
            </p>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Whether you're synthesizing complex research or preparing for exams, our tools adapt to your cognitive rhythm.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <span className="font-display-xl text-primary mb-2 text-5xl">2M+</span>
              <span className="font-label-md text-on-surface-variant">Hours of Flow</span>
            </div>
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <span className="font-display-xl text-secondary mb-2 text-5xl">4.9</span>
              <span className="font-label-md text-on-surface-variant">App Store Rating</span>
            </div>
            <div className="glass-card rounded-3xl p-8 col-span-2 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <span className="font-headline-md text-on-surface mb-2 relative z-10 text-2xl">Backed by Cognitive Science</span>
              <span className="font-body-md text-on-surface-variant relative z-10">Built with principles of spaced repetition and active recall.</span>
            </div>
          </motion.div>
        </section>

        {/* CTA Banner Section */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="relative rounded-3xl overflow-hidden py-24 px-8 text-center flex flex-col items-center justify-center mt-16 glass-card border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-fuchsia-900/20 z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container rounded-full mix-blend-screen filter blur-[120px] opacity-20 z-0 animate-pulse pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-8 items-center">
            <h2 className="font-display-xl text-display-xl text-on-surface leading-tight text-5xl md:text-6xl">
              Ready to enter your <br/>
              <span className="luminescent-text">Flow State?</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Join thousands of deep thinkers who have upgraded their study stack with Cognito.</p>
            <button 
              onClick={handleSignup}
              className="luminescent-button px-10 py-5 rounded-full font-label-md text-label-md text-white flex items-center gap-2 mt-4 text-lg hover:scale-[1.02] transition-all"
            >
              Get Started for Free
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 border-t border-zinc-900 bg-zinc-950 mt-section-margin transition-opacity duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-12 gap-8">
          <div className="text-lg font-bold text-zinc-700 font-label-md text-label-md">
            Cognito
          </div>
          <nav className="flex gap-6">
            <a className="font-inter text-xs tracking-widest uppercase text-zinc-600 dark:text-zinc-700 hover:text-indigo-500 hover:tracking-[0.15em] transition-all duration-300" href="#">Knowledge Base</a>
            <a className="font-inter text-xs tracking-widest uppercase text-zinc-600 dark:text-zinc-700 hover:text-indigo-500 hover:tracking-[0.15em] transition-all duration-300" href="#">Privacy Layer</a>
            <a className="font-inter text-xs tracking-widest uppercase text-zinc-600 dark:text-zinc-700 hover:text-indigo-500 hover:tracking-[0.15em] transition-all duration-300" href="#">API Docs</a>
          </nav>
          <div className="font-inter text-xs tracking-widest uppercase text-zinc-600 dark:text-zinc-700">
            © {new Date().getFullYear()} Cognito. Solarpunk study sanctuary.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
