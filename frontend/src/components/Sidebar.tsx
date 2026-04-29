import React from 'react';
import { MessageCircle, FileText, Video, Youtube, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth0 } from '@auth0/auth0-react';
import { ToolType } from '../types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
      onClick={onClick}
      aria-label={label}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
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
    <div className="w-64 bg-gray-900 h-full flex flex-col border-r border-gray-800/60">
      {/* Header */}
      <div className="p-5 border-b border-gray-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Cognito</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <SidebarItem
          icon={<MessageCircle className="w-full h-full" />}
          label="Chat"
          active={activeTool === 'chat'}
          onClick={() => handleToolChange('chat')}
        />
        <SidebarItem
          icon={<FileText className="w-full h-full" />}
          label="File Analyzer"
          active={activeTool === 'analyzer'}
          onClick={() => handleToolChange('analyzer')}
        />
        <SidebarItem
          icon={<Video className="w-full h-full" />}
          label="Video Recommender"
          active={activeTool === 'video-recommender'}
          onClick={() => handleToolChange('video-recommender')}
        />
        <SidebarItem
          icon={<Youtube className="w-full h-full" />}
          label="Video Summarizer"
          active={activeTool === 'summarizer'}
          onClick={() => handleToolChange('summarizer')}
        />
      </div>

      {/* User profile */}
      {isAuthenticated && user && (
        <div className="p-4 border-t border-gray-800/60">
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-700"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center ring-2 ring-gray-700">
                <span className="text-white text-sm font-medium">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user.name || 'Student'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;