import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useFocusTimer } from '../hooks/useFocusTimer';

const FocusPopup: React.FC = () => {
  const { addFocusSession } = useApp();
  const { addToast } = useToast();

  const {
    timer,
    secondsLeft,
    timerLabel,
    start,
    pause,
    reset,
  } = useFocusTimer({
    onFocusComplete: (state) => {
      addFocusSession(state.task, state.focusMinutes, state.breakMinutes);
      addToast('Focus round complete. Time for a short break.', 'success');
    },
    onBreakComplete: () => {
      addToast('Break complete. Back to deep work.', 'info');
    },
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');

    return () => {
      document.documentElement.classList.remove('light');
    };
  }, []);

  const phaseLabel = timer.phase === 'focus' ? 'Deep Focus' : 'Recharge';
  const canResume = !timer.isRunning && secondsLeft > 0;

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 text-on-surface">
      <div className="w-full max-w-sm rounded-[28px] border border-outline/70 bg-surface/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[28px]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
              Focus Popup
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{phaseLabel}</h1>
          </div>
          <button
            onClick={() => window.close()}
            className="rounded-full border border-outline/70 p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Close popup"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="rounded-[24px] border border-outline/60 bg-surface-container-low/70 p-5 text-center">
          <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full border border-outline/60 bg-surface-container shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant">{timer.phase}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{timerLabel}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-on-surface">{timer.task || 'Deep Work Session'}</p>
            <p className="text-sm text-on-surface-variant">
              {timer.focusMinutes}m focus / {timer.breakMinutes}m break
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              if (canResume) {
                start({
                  task: timer.task,
                  focusMinutes: timer.focusMinutes,
                  breakMinutes: timer.breakMinutes,
                  resumeCurrentPhase: true,
                });
              }
            }}
            disabled={!canResume}
            className="rounded-2xl border border-outline/60 bg-surface-container-low px-3 py-3 text-sm font-medium text-on-surface transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Resume
          </button>
          <button
            onClick={pause}
            className="rounded-2xl border border-outline/60 bg-surface-container-low px-3 py-3 text-sm font-medium text-on-surface transition hover:bg-surface-container"
          >
            Pause
          </button>
          <button
            onClick={reset}
            className="rounded-2xl bg-theme-gradient px-3 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(70,72,212,0.28)]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusPopup;
