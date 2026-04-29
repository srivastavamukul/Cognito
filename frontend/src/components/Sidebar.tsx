import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth0 } from '@auth0/auth0-react';
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
        className="w-full flex items-center gap-4 bg-indigo-500/10 text-indigo-400 rounded-3xl p-4 shadow-[0_0_20px_rgba(99,102,241,0.2)] font-inter text-sm font-semibold tracking-wide transition-all duration-300"
        onClick={onClick}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{iconName}</span>
        {label}
      </button>
    );
  }
  return (
    <button
      className="w-full flex items-center gap-4 text-zinc-500 dark:text-zinc-400 p-4 hover:bg-white/5 hover:text-white transition-colors duration-300 rounded-3xl font-inter text-sm font-semibold tracking-wide"
      onClick={onClick}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>{iconName}</span>
      {label}
    </button>
  );
};

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { activeTool, setActiveTool } = useApp();
  const { user, logout, isAuthenticated } = useAuth0();

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    onNavigate?.();
  };

  return (
    <nav className="flex flex-col h-full p-6 gap-2 bg-zinc-950/20 backdrop-blur-[40px] w-72 rounded-r-[40px] border-r border-white/5 shadow-[10px_0_40px_rgba(0,0,0,0.2)] z-20">
      {/* User Profile Block */}
      {isAuthenticated && user && (
        <div className="flex items-center gap-4 mb-8 p-4 glass-panel rounded-3xl">
          {user.picture ? (
            <img src={user.picture} alt={user.name || 'User'} className="w-12 h-12 rounded-full object-cover border border-indigo-500/30" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-500/30">
              <span className="text-white font-bold">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1 min-w-0 overflow-hidden text-left">
            <h3 className="font-label-md text-label-md text-white truncate">{user.name || 'Student'}</h3>
            <p className="font-body-md text-sm text-zinc-400 truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-grow">
        <SidebarItem
          iconName="forum"
          label="AI Chat Tutor"
          active={activeTool === 'chat'}
          onClick={() => handleToolChange('chat')}
        />
        <SidebarItem
          iconName="description"
          label="File Analyzer"
          active={activeTool === 'analyzer'}
          onClick={() => handleToolChange('analyzer')}
        />
        <SidebarItem
          iconName="smart_display"
          label="Video Recommender"
          active={activeTool === 'video-recommender'}
          onClick={() => handleToolChange('video-recommender')}
        />
        <SidebarItem
          iconName="movie"
          label="Video Summarizer"
          active={activeTool === 'summarizer'}
          onClick={() => handleToolChange('summarizer')}
        />
      </div>

      {/* CTA / Logout Button */}
      {isAuthenticated && (
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="mt-auto glass-panel py-4 px-6 rounded-full flex items-center justify-center gap-2 text-white font-label-md hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Log Out
        </button>
      )}
    </nav>
  );
};

export default Sidebar;