import { useCallback, useEffect, useMemo, useState } from 'react';
import { FocusPhase } from '../types';

export interface FocusTimerState {
  task: string;
  focusMinutes: number;
  breakMinutes: number;
  phase: FocusPhase;
  isRunning: boolean;
  remainingSeconds: number;
  phaseEndsAt: number | null;
  completedCycles: number;
}

interface StartOptions {
  task: string;
  focusMinutes: number;
  breakMinutes: number;
  resumeCurrentPhase?: boolean;
}

interface UseFocusTimerOptions {
  onFocusComplete?: (state: FocusTimerState) => void;
  onBreakComplete?: (state: FocusTimerState) => void;
}

const STORAGE_KEY = 'cognito_focus_timer_state_v1';
const EVENT_NAME = 'cognito-focus-timer-change';

const DEFAULT_STATE: FocusTimerState = {
  task: '',
  focusMinutes: 25,
  breakMinutes: 5,
  phase: 'focus',
  isRunning: false,
  remainingSeconds: 25 * 60,
  phaseEndsAt: null,
  completedCycles: 0,
};

const isBrowser = typeof window !== 'undefined';

const clampSeconds = (value: number) => Math.max(0, Math.round(value));

export const readFocusTimerState = (): FocusTimerState => {
  if (!isBrowser) return DEFAULT_STATE;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;

  try {
    const parsed = JSON.parse(raw) as Partial<FocusTimerState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      remainingSeconds: clampSeconds(parsed.remainingSeconds ?? DEFAULT_STATE.remainingSeconds),
      phaseEndsAt: parsed.phaseEndsAt ?? null,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

export const getSecondsLeft = (state: FocusTimerState, now = Date.now()) => {
  if (!state.isRunning || !state.phaseEndsAt) {
    return clampSeconds(state.remainingSeconds);
  }

  return clampSeconds(Math.ceil((state.phaseEndsAt - now) / 1000));
};

const writeFocusTimerState = (state: FocusTimerState) => {
  if (!isBrowser) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }));
};

const getNextPhaseState = (state: FocusTimerState, now = Date.now()): FocusTimerState => {
  if (state.phase === 'focus') {
    return {
      ...state,
      phase: 'break',
      isRunning: true,
      remainingSeconds: state.breakMinutes * 60,
      phaseEndsAt: now + state.breakMinutes * 60 * 1000,
      completedCycles: state.completedCycles + 1,
    };
  }

  return {
    ...state,
    phase: 'focus',
    isRunning: true,
    remainingSeconds: state.focusMinutes * 60,
    phaseEndsAt: now + state.focusMinutes * 60 * 1000,
  };
};

export const advanceFocusTimerIfNeeded = (now = Date.now()) => {
  const snapshot = readFocusTimerState();
  if (!snapshot.isRunning || !snapshot.phaseEndsAt || snapshot.phaseEndsAt > now) {
    return { state: snapshot, transition: null as FocusPhase | null };
  }

  const latest = readFocusTimerState();
  if (
    !latest.isRunning ||
    latest.phase !== snapshot.phase ||
    latest.phaseEndsAt !== snapshot.phaseEndsAt
  ) {
    return { state: latest, transition: null as FocusPhase | null };
  }

  const next = getNextPhaseState(snapshot, now);
  writeFocusTimerState(next);
  return { state: next, transition: snapshot.phase };
};

export const useFocusTimer = (options: UseFocusTimerOptions = {}) => {
  const { onFocusComplete, onBreakComplete } = options;
  const [timer, setTimer] = useState<FocusTimerState>(() => readFocusTimerState());

  const sync = useCallback(() => {
    setTimer(readFocusTimerState());
  }, []);

  useEffect(() => {
    sync();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === STORAGE_KEY) {
        sync();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(EVENT_NAME, sync as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(EVENT_NAME, sync as EventListener);
    };
  }, [sync]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const { state, transition } = advanceFocusTimerIfNeeded(Date.now());
      setTimer(state);

      if (transition === 'focus') onFocusComplete?.(state);
      if (transition === 'break') onBreakComplete?.(state);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onBreakComplete, onFocusComplete]);

  const start = useCallback((options: StartOptions) => {
    const now = Date.now();
    const current = readFocusTimerState();
    const nextPhase = options.resumeCurrentPhase ? current.phase : 'focus';
    const remainingSeconds = options.resumeCurrentPhase
      ? Math.max(1, getSecondsLeft(current, now))
      : options.focusMinutes * 60;

    const next: FocusTimerState = {
      task: options.task.trim() || 'Deep Work Session',
      focusMinutes: options.focusMinutes,
      breakMinutes: options.breakMinutes,
      phase: nextPhase,
      isRunning: true,
      remainingSeconds,
      phaseEndsAt: now + remainingSeconds * 1000,
      completedCycles: options.resumeCurrentPhase ? current.completedCycles : 0,
    };

    writeFocusTimerState(next);
    setTimer(next);
  }, []);

  const pause = useCallback(() => {
    const snapshot = readFocusTimerState();
    const next: FocusTimerState = {
      ...snapshot,
      isRunning: false,
      remainingSeconds: getSecondsLeft(snapshot),
      phaseEndsAt: null,
    };

    writeFocusTimerState(next);
    setTimer(next);
  }, []);

  const reset = useCallback(() => {
    const snapshot = readFocusTimerState();
    const next: FocusTimerState = {
      ...snapshot,
      phase: 'focus',
      isRunning: false,
      remainingSeconds: snapshot.focusMinutes * 60,
      phaseEndsAt: null,
      completedCycles: 0,
    };

    writeFocusTimerState(next);
    setTimer(next);
  }, []);

  const secondsLeft = getSecondsLeft(timer);
  const timerLabel = useMemo(() => {
    const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const ss = (secondsLeft % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }, [secondsLeft]);

  return {
    timer,
    secondsLeft,
    timerLabel,
    start,
    pause,
    reset,
    sync,
  };
};
