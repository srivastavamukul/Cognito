import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useFocusTimer } from '../hooks/useFocusTimer';

const FocusFlow: React.FC = () => {
  const { focusSessions, addFocusSession, clearFocusSessions } = useApp();
  const { addToast } = useToast();
  const { timer, secondsLeft, timerLabel, start, pause, reset } = useFocusTimer({
    onFocusComplete: (state) => {
      addFocusSession(state.task, state.focusMinutes, state.breakMinutes);
      addToast('Focus round complete. Time for a short break.', 'success');
    },
    onBreakComplete: () => {
      addToast('Break complete. Back to deep work.', 'info');
    },
  });

  const [task, setTask] = useState(timer.task);
  const [focusMinutes, setFocusMinutes] = useState(timer.focusMinutes);
  const [breakMinutes, setBreakMinutes] = useState(timer.breakMinutes);

  useEffect(() => {
    if (timer.isRunning) return;
    setTask(timer.task);
    setFocusMinutes(timer.focusMinutes);
    setBreakMinutes(timer.breakMinutes);
  }, [timer.breakMinutes, timer.focusMinutes, timer.isRunning, timer.task]);

  const totalSeconds = (timer.phase === 'focus' ? timer.focusMinutes : timer.breakMinutes) * 60;
  const progress = useMemo(() => {
    if (totalSeconds <= 0) return 0;
    return Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));
  }, [secondsLeft, totalSeconds]);

  const openPopup = () => {
    const popup = window.open(
      '/focus-popup',
      'cognito-focus-popup',
      'popup=yes,width=420,height=560,left=80,top=80,resizable=yes'
    );

    if (!popup) {
      addToast('Popup blocked by the browser. Please allow popups for Cognito.', 'warning');
      return;
    }

    popup.focus();
  };

  const canResume = !timer.isRunning && secondsLeft > 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-y-auto p-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Library Focus Timer</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-on-surface">Focus Flow</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-on-surface-variant">
            The timer is back inside Library. Start a session here, then pop it out into a detached window while you move around the rest of the app or the web.
          </p>
        </div>

        <button
          onClick={openPopup}
          className="inline-flex items-center gap-2 rounded-full border border-outline/70 bg-surface-container-low px-5 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          Open Popup Timer
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel rounded-[30px] p-8">
          <label className="mb-2 block text-sm text-on-surface-variant">Session intention</label>
          <input
            type="text"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            placeholder="What will you finish in this session?"
            className="w-full rounded-2xl border border-outline/70 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-primary"
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-on-surface-variant">Focus minutes</label>
              <input
                type="number"
                min={5}
                max={90}
                value={focusMinutes}
                onChange={(event) => setFocusMinutes(Math.max(5, Number(event.target.value) || 25))}
                className="w-full rounded-2xl border border-outline/70 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-on-surface-variant">Break minutes</label>
              <input
                type="number"
                min={1}
                max={30}
                value={breakMinutes}
                onChange={(event) => setBreakMinutes(Math.max(1, Number(event.target.value) || 5))}
                className="w-full rounded-2xl border border-outline/70 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => start({ task, focusMinutes, breakMinutes })}
              className="rounded-full bg-theme-gradient px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(70,72,212,0.3)]"
            >
              Start New Session
            </button>
            <button
              onClick={() => {
                if (canResume) {
                  start({ task, focusMinutes, breakMinutes, resumeCurrentPhase: true });
                }
              }}
              disabled={!canResume}
              className="rounded-full border border-outline/70 bg-surface-container-low px-5 py-3 text-sm font-medium text-on-surface transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Resume
            </button>
            <button
              onClick={pause}
              className="rounded-full border border-outline/70 bg-surface-container-low px-5 py-3 text-sm font-medium text-on-surface transition hover:bg-surface-container"
            >
              Pause
            </button>
            <button
              onClick={reset}
              className="rounded-full border border-outline/70 bg-surface-container-low px-5 py-3 text-sm font-medium text-on-surface transition hover:bg-surface-container"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-6 flex h-56 w-56 items-center justify-center rounded-full border border-outline/70 bg-surface-container">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--color-primary) ${progress}%, color-mix(in srgb, var(--color-outline) 20%, transparent) ${progress}% 100%)`,
                }}
              />
              <div className="absolute inset-[14px] rounded-full bg-background/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant">
                  {timer.phase === 'focus' ? 'Deep Focus' : 'Break'}
                </p>
                <p className="mt-2 text-5xl font-semibold tracking-tight text-on-surface">{timerLabel}</p>
              </div>
            </div>

            <p className="text-base font-medium text-on-surface">{timer.task || task || 'Deep Work Session'}</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Completed cycles in this run: <span className="font-semibold text-primary">{timer.completedCycles}</span>
            </p>
          </div>
        </section>
      </div>

      <section className="glass-panel mt-6 rounded-[30px] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-on-surface">Recent Sessions</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Your latest completed focus rounds stay here in the Library history.</p>
          </div>
          <button
            onClick={clearFocusSessions}
            className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Clear history
          </button>
        </div>

        {focusSessions.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-outline/70 bg-surface-container-low/60 p-6 text-sm text-on-surface-variant">
            No sessions completed yet. Start a focus block and the library will log each finished cycle.
          </div>
        ) : (
          <div className="grid gap-3">
            {focusSessions.slice(0, 8).map((session) => (
              <div key={session.id} className="rounded-[22px] border border-outline/60 bg-surface-container-low/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-on-surface">{session.task}</p>
                    <p className="text-sm text-on-surface-variant">{session.completedAt.toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {session.focusMinutes}m focus / {session.breakMinutes}m break
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FocusFlow;
