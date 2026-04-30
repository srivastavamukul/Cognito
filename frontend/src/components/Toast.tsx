import React from 'react';
import { useToast } from '../context/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        let bgColor = 'bg-zinc-800';
        let borderColor = 'border-zinc-600';
        let icon = 'info';
        
        if (toast.type === 'success') {
          bgColor = 'bg-emerald-900/80';
          borderColor = 'border-emerald-500';
          icon = 'check_circle';
        } else if (toast.type === 'info') {
          bgColor = 'bg-sky-900/80';
          borderColor = 'border-sky-500';
          icon = 'info';
        } else if (toast.type === 'error') {
          bgColor = 'bg-red-900/80';
          borderColor = 'border-red-500';
          icon = 'error';
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-900/80';
          borderColor = 'border-amber-500';
          icon = 'warning';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md animate-fadeIn ${bgColor} ${borderColor} text-white`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <p className="font-body-md text-sm">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-auto text-zinc-300 hover:text-white">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
