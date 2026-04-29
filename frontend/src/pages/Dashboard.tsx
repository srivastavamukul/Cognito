import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { AppProvider } from '../context/AppContext';
import { Menu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-900 text-white relative">
        {/* Mobile hamburger */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-30"
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

        <MainContent />
      </div>
    </AppProvider>
  );
};

export default Dashboard;
