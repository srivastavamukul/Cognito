import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { useAuth0 } from '@auth0/auth0-react';
// Mock useAuth0 for testing without API
const useAuth0 = () => {
  const navigate = useNavigate();
  return {
    user: { given_name: 'Test' },
    logout: () => navigate('/'),
  };
};

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppShellHeader from '../components/AppShellHeader';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth0();
  const {
    messages,
    analysisResults,
    videoRecommendations,
    videoSummaries,
    focusSessions,
  } = useApp();

  const metrics = useMemo(() => {
    const recommendedVideos = videoRecommendations.reduce((total, item) => total + item.videos.length, 0);
    return [
      {
        label: 'Chat Threads',
        value: Math.max(messages.length - 1, 0),
        detail: 'Live AI conversations saved in your study trail.',
        icon: 'forum',
      },
      {
        label: 'Analyses',
        value: analysisResults.length,
        detail: 'Performance breakdowns ready for follow-up review.',
        icon: 'analytics',
      },
      {
        label: 'Recommendations',
        value: recommendedVideos,
        detail: 'Curated video lessons mapped from your weak areas.',
        icon: 'smart_display',
      },
      {
        label: 'Summaries',
        value: videoSummaries.length,
        detail: 'Lecture breakdowns stored for fast revision.',
        icon: 'description',
      },
    ];
  }, [analysisResults.length, messages.length, videoRecommendations, videoSummaries.length]);

  const recentSignals = [
    {
      title: 'Library workspace restored',
      body: 'The previous dashboard now lives under Library with the tool sidebar and focus timer.',
    },
    {
      title: 'Theme systems aligned',
      body: 'The interface now stays in a single premium dark system across both dashboard and library.',
    },
    {
      title: 'Overview surface simplified',
      body: 'Focus controls were removed here so Dashboard can stay analytics-first and less cluttered.',
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-background text-on-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,99,238,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(156,72,234,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(0,136,93,0.14),transparent_25%)]" />

      <AppShellHeader
        subtitle="Unified Learning Dashboard"
        active="dashboard"
        onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      />

      <main className="scrollbar-none relative z-10 mx-auto h-[calc(100vh-89px)] max-w-[1200px] overflow-y-auto px-6 pb-20 pt-10">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative overflow-hidden rounded-[34px] p-8 md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(192,193,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,171,255,0.08),transparent_30%)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Dashboard</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-on-surface md:text-6xl">
              Welcome back{user?.given_name ? `, ${user.given_name}` : ''}.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-on-surface-variant">
              This new top-level dashboard uses the Unified Landing Page template for logged-in users and keeps the spotlight on analytics, study momentum, and next actions.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/library"
                className="rounded-[14px] bg-theme-gradient px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(70,72,212,0.26)] transition-transform hover:scale-[1.02]"
              >
                Open Library Workspace
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <article className="glass-card relative overflow-hidden rounded-[30px] p-6">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,136,93,0.16),transparent_32%)]" />
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-fixed/30 text-tertiary">
                  <span className="material-symbols-outlined">query_stats</span>
                </div>
                <span className="text-sm font-semibold text-tertiary">Live overview</span>
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-on-surface-variant">Focus history</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-on-surface">{focusSessions.length}</p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">Completed cycles stored in Library, surfaced here as progress insight.</p>
            </article>

            <article className="glass-card relative overflow-hidden rounded-[30px] p-6">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_top_left,rgba(192,193,255,0.2),transparent_34%)]" />
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed/45 text-primary">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <span className="text-sm font-semibold text-primary">Workspace ready</span>
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-on-surface-variant">Active surfaces</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-on-surface">2</p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">Dashboard for overview, Library for the full study tool stack.</p>
            </article>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric) => (
            <article key={metric.label} className="glass-card relative overflow-hidden rounded-[28px] p-6">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_24%)]" />
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-container text-primary">
                  <span className="material-symbols-outlined">{metric.icon}</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                  {metric.label}
                </span>
              </div>
              <p className="text-4xl font-semibold tracking-tight text-on-surface">{metric.value}</p>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{metric.detail}</p>
            </article>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <article className="glass-card rounded-[34px] p-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">Analytics</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-on-surface">Deep insight overview</h2>
              </div>
              <Link to="/library" className="text-sm font-semibold text-primary">
                Go to Library
              </Link>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Study coverage</span>
                  <span className="font-semibold text-on-surface">82%</span>
                </div>
                <div className="h-3 rounded-full bg-surface-container-high">
                  <div className="h-full w-[82%] rounded-full bg-theme-gradient shadow-[0_0_18px_rgba(70,72,212,0.32)]" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Retention pulse</span>
                  <span className="font-semibold text-on-surface">91%</span>
                </div>
                <div className="h-3 rounded-full bg-surface-container-high">
                  <div
                    className="h-full w-[91%] rounded-full shadow-[0_0_18px_rgba(0,136,93,0.24)]"
                    style={{ background: 'linear-gradient(135deg, rgb(var(--color-tertiary)), rgb(var(--color-secondary)))' }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-outline/60 bg-surface-container-low/80 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Library backups</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-on-surface">Stable</p>
                  <p className="mt-2 text-sm text-on-surface-variant">Your backup and restore workflows remain in the Library surface.</p>
                </div>
                <div className="rounded-[22px] border border-outline/60 bg-surface-container-low/80 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant">Visual parity</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-on-surface">Aligned</p>
                  <p className="mt-2 text-sm text-on-surface-variant">Shared dark tokens across landing, dashboard, and workspace.</p>
                </div>
              </div>
            </div>
          </article>

          <article className="glass-card rounded-[34px] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-tertiary">System Notes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-on-surface">Recent changes</h2>
            <div className="mt-8 space-y-4">
              {recentSignals.map((signal) => (
                <div key={signal.title} className="rounded-[22px] border border-outline/60 bg-surface-container-low/80 p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-on-surface">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{signal.body}</p>
                </div>
              ))}
            </div>
          </article>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;
