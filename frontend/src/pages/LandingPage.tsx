import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';

const featureCards = [
  {
    icon: 'psychology',
    title: 'AI Brainstorm',
    description: 'Socratic prompts, concept mapping, and study plans that keep your thinking in motion.',
    accent: 'text-primary',
  },
  {
    icon: 'description',
    title: 'File Analyzer',
    description: 'Upload your performance data and surface exactly where your attention should go next.',
    accent: 'text-secondary',
  },
  {
    icon: 'smart_display',
    title: 'Video Summaries',
    description: 'Turn long lectures into clean takeaways, timestamps, and revision-ready notes.',
    accent: 'text-tertiary',
  },
];

const LandingPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(128,131,255,0.18),transparent_25%),radial-gradient(circle_at_85%_18%,rgba(174,5,198,0.18),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(0,154,218,0.1),transparent_30%)]" />

      <header className="sticky top-0 z-[80] px-4 pt-4 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[30px] border border-outline/55 bg-surface/58 px-4 py-3 shadow-[0_18px_56px_rgba(0,0,0,0.18)] backdrop-blur-[26px] md:px-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="luminescent-text inline-block text-xl font-extrabold tracking-tight">
              Cognito Premium
            </p>
          </div>

          <nav className="hidden items-center gap-2 rounded-full border border-outline/45 bg-surface-container-low/55 px-2 py-1.5 md:flex">
            <a className="rounded-full bg-surface-container px-4 py-2 text-sm font-medium text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" href="#home">Home</a>
            <a className="rounded-full px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface" href="#features">Features</a>
            <a className="rounded-full px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface" href="#experience">Experience</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openSignIn({ forceRedirectUrl: '/dashboard' })}
              className="rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              Log In
            </button>
            <button
              onClick={() => openSignUp({ forceRedirectUrl: '/dashboard' })}
              className="rounded-full bg-theme-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.28)] transition-transform hover:scale-[1.02]"
            >
              Start Free
            </button>
          </div>
        </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-24 px-6 pb-24 pt-16 md:px-10">
        <section id="home" className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Premium Study Sanctuary
            </span>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.045em] text-on-surface md:text-7xl">
                Deep work tools,
                <span className="luminescent-text block">designed to feel calm.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-on-surface-variant md:text-xl">
                Cognito combines AI tutoring, data-driven study insights, video synthesis, and library workflows inside
                a premium solarpunk interface built for long focus sessions.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openSignIn({ forceRedirectUrl: '/dashboard' })}
                className="rounded-full bg-theme-gradient px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(99,102,241,0.28)] transition-transform hover:scale-[1.02]"
              >
                Enter Cognito
              </button>
              <a
                href="#features"
                className="rounded-full border border-outline/70 bg-surface-container-low/80 px-7 py-4 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="grid h-[560px] gap-4 sm:grid-cols-2 sm:grid-rows-2"
          >
            <div className="glass-card relative row-span-2 overflow-hidden rounded-[34px] p-6">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_35%),url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-45" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    psychology
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-on-surface-variant">Live Workspace</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-on-surface">AI tutoring with context-aware study tools</h2>
                </div>
              </div>
            </div>

            <div className="glass-card flex flex-col items-center justify-center rounded-[34px] p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-secondary/25 bg-secondary/10 text-secondary">
                <span className="material-symbols-outlined text-[30px]">insights</span>
              </div>
              <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Retention Tracking</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-on-surface">88%</p>
            </div>

            <div className="glass-card relative overflow-hidden rounded-[34px] p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,154,218,0.24),transparent_35%)]" />
              <div className="relative z-10 flex h-full items-end justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Library Sync</p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-on-surface">Back up and restore every learning artifact</p>
                </div>
                <span className="material-symbols-outlined text-secondary">sync</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="space-y-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Core System</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-on-surface">A premium toolkit for focused learning.</h2>
            <p className="mt-4 text-lg leading-8 text-on-surface-variant">
              The dark theme follows the Premium Study Assistant palette so every surface, accent, and interaction feels consistent from the first page to the deepest workspace.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((card) => (
              <article key={card.title} className="glass-card rounded-[28px] p-8">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-surface-container-low ${card.accent}`}>
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {card.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-on-surface">{card.title}</h3>
                <p className="mt-3 text-base leading-7 text-on-surface-variant">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card rounded-[32px] p-8 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">Built for Flow</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-on-surface">From landing page to study session, the mood stays coherent.</h2>
            <p className="mt-4 text-base leading-8 text-on-surface-variant">
              Cognito's dark system leans on warm void surfaces, electric indigo action states, and orchid highlights, keeping the product calm and consistent from the landing page into the workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openSignIn({ forceRedirectUrl: '/dashboard' })}
                className="rounded-full bg-theme-gradient px-6 py-3 text-sm font-semibold text-white"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-8 md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[24px] border border-outline/60 bg-surface-container-low/70 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Analytics</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-on-surface">124</p>
                <p className="mt-2 text-sm text-on-surface-variant">Concepts mastered and ready for spaced review.</p>
              </div>
              <div className="rounded-[24px] border border-outline/60 bg-surface-container-low/70 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Focus Library</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-on-surface">42h</p>
                <p className="mt-2 text-sm text-on-surface-variant">Flow time restored to the Library workspace where it belongs.</p>
              </div>
              <div className="sm:col-span-2 rounded-[24px] border border-outline/60 bg-surface-container-low/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Study Signals</p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-on-surface">A cohesive dark system across the entire product.</p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary">query_stats</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
