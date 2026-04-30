import React, { useState } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// Mock useAuth0 for testing without API
const useAuth0 = () => ({
  user: { given_name: 'Test' },
  isAuthenticated: false,
});

import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import ToastContainer from '../components/Toast';
import AppShellHeader from '../components/AppShellHeader';

const Library: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth0();

  return (
    <div className="relative h-screen overflow-hidden text-on-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(128,131,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(174,5,198,0.12),transparent_24%)]" />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="relative z-10 flex h-screen gap-4 p-4">
        <div
          className={`
            fixed inset-y-4 left-4 z-40 transition-transform duration-300 ease-out md:relative md:inset-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%] md:translate-x-0'}
          `}
        >
          <Sidebar
            onNavigate={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
          />
        </div>

        <main role="main" aria-label="Library workspace" className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[34px] border border-outline/55 bg-surface/42 shadow-[0_24px_70px_rgba(0,0,0,0.14)] backdrop-blur-[24px]">
          <AppShellHeader
            subtitle={user?.given_name ? `${user.given_name}'s Library` : 'Your Library'}
            active="library"
            onLogout={() => {
              window.location.href = '/';
            }}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <KeyboardShortcuts onEscape={() => setSidebarOpen(false)} />
          <MainContent />
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default Library;
