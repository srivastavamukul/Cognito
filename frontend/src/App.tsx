import React, { useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import FocusPopup from './pages/FocusPopup';

const AuthenticatedLayout: React.FC = () => (
  <ProtectedRoute>
    <ToastProvider>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </ToastProvider>
  </ProtectedRoute>
);

const routeOrder: Record<string, number> = {
  '/dashboard': 0,
  '/library': 1,
  '/focus-popup': 2,
};

const TestLayout: React.FC = () => {
  const outlet = useOutlet();
  const location = useLocation();
  const previousIndexRef = useRef(routeOrder[location.pathname] ?? 0);

  const direction = useMemo(() => {
    const nextIndex = routeOrder[location.pathname] ?? 0;
    return nextIndex >= previousIndexRef.current ? 1 : -1;
  }, [location.pathname]);

  useEffect(() => {
    previousIndexRef.current = routeOrder[location.pathname] ?? 0;
  }, [location.pathname]);

  return (
    <ToastProvider>
      <AppProvider>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 72 : -72, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -72 : 72, scale: 0.985 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </AppProvider>
    </ToastProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/focus-popup" element={<FocusPopup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
