import React from 'react';
import { Link } from 'react-router-dom';

interface WorkspaceSwitcherProps {
  active: 'dashboard' | 'library';
}

const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ active }) => {
  return (
    <div className="flex items-center rounded-full border border-outline/60 bg-surface-container-low/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
      <Link
        to="/dashboard"
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
          active === 'dashboard'
            ? 'bg-theme-gradient text-white shadow-[0_12px_30px_rgba(70,72,212,0.28)]'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        Dashboard
      </Link>
      <Link
        to="/library"
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
          active === 'library'
            ? 'bg-theme-gradient text-white shadow-[0_12px_30px_rgba(70,72,212,0.28)]'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        Library
      </Link>
    </div>
  );
};

export default WorkspaceSwitcher;
