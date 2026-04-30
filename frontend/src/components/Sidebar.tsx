import React from 'react';
import { useApp } from '../context/AppContext';
// import { useAuth0 } from '@auth0/auth0-react';

// Mock useAuth0 for testing without API
const useAuth0 = () => ({
  isAuthenticated: false,
  user: null,
  logout: ({ logoutParams }: any) => { console.log('Logout called', logoutParams); },
  loginWithRedirect: () => { console.log('Login called'); }
});

import { ToolType } from '../types';

interface SidebarItemProps {
  iconName: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ iconName, label, active, onClick }) => {
  if (active) {
    return (
      <button
        aria-label={label}
        className="flex w-full items-center gap-4 rounded-[22px] bg-primary/14 p-4 text-primary shadow-[0_12px_28px_rgba(99,102,241,0.18)] transition-all duration-300"
        onClick={onClick}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{iconName}</span>
        {label}
      </button>
    );
  }
  return (
    <button
      aria-label={label}
      className="flex w-full items-center gap-4 rounded-[22px] p-4 text-on-surface-variant transition-colors duration-300 hover:bg-surface-container hover:text-on-surface"
      onClick={onClick}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>{iconName}</span>
      {label}
    </button>
  );
};

interface SidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, collapsed = false, onToggleCollapse }) => {
  const { activeTool, setActiveTool } = useApp();
  const { user: auth0User, isAuthenticated } = useAuth0();

  // Mock user for testing when not authenticated
  const user = isAuthenticated ? auth0User : {
    name: 'Test Student',
    email: 'test@cognito.ai',
    picture: null
  };
  const showProfile = true; // Always show profile for testing

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    onNavigate?.();
  };

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className={`glass-panel z-20 flex h-full flex-col gap-2 rounded-[34px] border border-outline/55 px-5 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.16)] transition-all duration-300 ${collapsed ? 'w-24' : 'w-[296px]'}`}
    >
      <div className={`mb-4 flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
        {onToggleCollapse && (
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapse}
            className="rounded-full border border-outline/60 bg-surface-container-low/70 p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        )}
      </div>

      {/* User Profile Block (3.4) */}
      {showProfile && !collapsed && (
        <div className="glass-card mb-6 flex items-center gap-4 rounded-[24px] p-4">
          {user.picture ? (
            <img src={user.picture} alt={user.name || 'User'} className="w-10 h-10 rounded-full object-cover border border-indigo-500/30 flex-shrink-0" />
          ) : (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-on-surface">
              <span className="text-white font-bold text-sm">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1 min-w-0 overflow-hidden text-left">
            <h3 className="truncate text-sm font-semibold text-on-surface">{user.name || 'Student'}</h3>
            <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
          </div>
        </div>
      )}
      {/* Collapsed: show avatar only */}
      {showProfile && collapsed && (
        <div className="mb-4 flex justify-center">
          {user.picture ? (
            <img src={user.picture} alt={user.name || 'User'} className="w-10 h-10 rounded-full object-cover border border-indigo-500/30" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-surface">
              <span className="text-on-surface font-bold text-sm">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-grow">
        {collapsed ? (
          // Collapsed: icon-only buttons
          <>
            {[
              { tool: 'brainstorm' as ToolType, icon: 'psychology', label: 'AI Brainstorm' },
              { tool: 'focus-flow' as ToolType, icon: 'timer', label: 'Focus Flow' },
              { tool: 'analyzer' as ToolType, icon: 'description', label: 'File Analyzer' },
              { tool: 'video-recommender' as ToolType, icon: 'smart_display', label: 'Video Recommender' },
              { tool: 'summarizer' as ToolType, icon: 'movie', label: 'Video Summarizer' },
              { tool: 'library-sync' as ToolType, icon: 'sync', label: 'Sync Your Library' },
            ].map(({ tool, icon, label }) => (
              <button
                key={tool}
                aria-label={label}
                title={label}
                onClick={() => handleToolChange(tool)}
                className={`flex items-center justify-center rounded-[20px] p-4 transition-all duration-300 ${activeTool === tool
                  ? 'bg-primary/14 text-primary shadow-[0_10px_24px_rgba(99,102,241,0.16)]'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTool === tool ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
              </button>
            ))}
          </>
        ) : (
          // Expanded: full labels
          <>
            <SidebarItem iconName="psychology" label="AI Brainstorm" active={activeTool === 'brainstorm'} onClick={() => handleToolChange('brainstorm')} />
            <SidebarItem iconName="timer" label="Focus Flow" active={activeTool === 'focus-flow'} onClick={() => handleToolChange('focus-flow')} />
            <SidebarItem iconName="description" label="File Analyzer" active={activeTool === 'analyzer'} onClick={() => handleToolChange('analyzer')} />
            <SidebarItem iconName="smart_display" label="Video Recommender" active={activeTool === 'video-recommender'} onClick={() => handleToolChange('video-recommender')} />
            <SidebarItem iconName="movie" label="Video Summarizer" active={activeTool === 'summarizer'} onClick={() => handleToolChange('summarizer')} />
            <SidebarItem iconName="sync" label="Sync Your Library" active={activeTool === 'library-sync'} onClick={() => handleToolChange('library-sync')} />
          </>
        )}
      </div>

    </nav>
  );
};

export default Sidebar;
