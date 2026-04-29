import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { AppProvider } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden font-body-md text-white relative">
        {/* Mobile hamburger overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:relative z-40 h-full
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main Workspace Area */}
        <main className="flex-grow flex flex-col relative overflow-hidden">
          {/* TopAppBar */}
          <header className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto bg-zinc-950/40 backdrop-blur-[40px] sticky top-0 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] z-10">
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden text-zinc-400 hover:text-indigo-300 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="font-headline-md text-headline-md text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-orchid-400 to-indigo-500 tracking-tight">Cognito</h1>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-zinc-500 dark:text-zinc-400 hover:backdrop-blur-[60px] hover:border-white/20 hover:text-indigo-300 transition-all duration-500 ease-out rounded-full p-2">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="text-zinc-500 dark:text-zinc-400 hover:backdrop-blur-[60px] hover:border-white/20 hover:text-indigo-300 transition-all duration-500 ease-out rounded-full p-2 md:hidden">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </header>

          <MainContent />
        </main>
      </div>
    </AppProvider>
  );
};

export default Dashboard;
