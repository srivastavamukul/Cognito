import React from 'react';
import { Link } from 'react-router-dom';
import WorkspaceSwitcher from './WorkspaceSwitcher';

interface AppShellHeaderProps {
  subtitle: string;
  active: 'dashboard' | 'library';
  onLogout: () => void;
  onOpenSidebar?: () => void;
}

const AppShellHeader: React.FC<AppShellHeaderProps> = ({
  subtitle,
  active,
  onLogout,
  onOpenSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-outline/60 bg-surface/72 px-5 py-4 backdrop-blur-[30px] shadow-[0_10px_28px_rgba(0,0,0,0.12)] md:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onOpenSidebar ? (
            <button
              aria-label="Open sidebar menu"
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface md:hidden"
              onClick={onOpenSidebar}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          ) : null}
          <Link to="/dashboard" className="min-w-0">
            <p className="luminescent-text inline-block text-xl font-extrabold tracking-tight">Cognito</p>
            <p className="truncate text-xs uppercase tracking-[0.22em] text-on-surface-variant">{subtitle}</p>
          </Link>
        </div>
        <div className="hidden md:block">
          <WorkspaceSwitcher active={active} />
        </div>
        <button
          onClick={onLogout}
          className="rounded-full border border-outline/70 bg-surface-container-low/80 px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AppShellHeader;
