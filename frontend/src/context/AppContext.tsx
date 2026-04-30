import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ToolType,
  Message,
  AnalysisResult,
  VideoRecommendation,
  VideoSummary,
  FocusSession,
  LibraryBackupPayload,
} from '../types';

interface AppContextType {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  clearMessages: () => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;

  // Analyzer
  analysisResults: AnalysisResult[];
  addAnalysisResult: (fileName: string, fileType: string, fileSize: string, analysisData: string[]) => void;

  // Video Recommender
  videoRecommendations: VideoRecommendation[];
  setVideoRecommendations: (recommendations: VideoRecommendation[]) => void;

  // Summarizer
  videoSummaries: VideoSummary[];
  addVideoSummary: (videoUrl: string, videoTitle: string, summary: string) => void;

  // Focus Flow
  focusSessions: FocusSession[];
  addFocusSession: (task: string, focusMinutes: number, breakMinutes: number) => void;
  clearFocusSessions: () => void;

  // Library sync metadata
  lastLibrarySyncAt: Date | null;
  setLastLibrarySyncAt: (timestamp: Date | null) => void;
  restoreFromLibraryBackup: (payload: LibraryBackupPayload, mode: 'merge' | 'replace') => void;

  // Cross-tool search
  prefilledTopic: string;
  setPrefilledTopic: (topic: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  content: "Hello! I'm Cognito, your AI study assistant. Ask me anything about your coursework, or try one of the tools in the sidebar.",
  role: 'assistant',
  timestamp: new Date(),
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<ToolType>('brainstorm');
  const [isDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('dark');
    html.classList.remove('light');
    localStorage.setItem('cognito_theme', 'dark');
  }, [isDarkMode]);

  const toggleTheme = () => {};
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('cognito_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {}
    }
    return [WELCOME_MESSAGE];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [prefilledTopic, setPrefilledTopic] = useState('');

  // Analyzer states
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>(() => {
    const saved = localStorage.getItem('cognito_analysisResults');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {}
    }
    return [];
  });

  // Video Recommender states
  const [videoRecommendations, setVideoRecommendations] = useState<VideoRecommendation[]>(() => {
    const saved = localStorage.getItem('cognito_videoRecommendations');
    return saved ? JSON.parse(saved) : [];
  });

  // Summarizer states
  const [videoSummaries, setVideoSummaries] = useState<VideoSummary[]>(() => {
    const saved = localStorage.getItem('cognito_videoSummaries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {}
    }
    return [];
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('cognito_focusSessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, completedAt: new Date(m.completedAt) }));
      } catch (e) {}
    }
    return [];
  });

  const [lastLibrarySyncAt, setLastLibrarySyncAtState] = useState<Date | null>(() => {
    const saved = localStorage.getItem('cognito_lastLibrarySyncAt');
    if (!saved) return null;
    const parsed = new Date(saved);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  });

  useEffect(() => {
    localStorage.setItem('cognito_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cognito_analysisResults', JSON.stringify(analysisResults));
  }, [analysisResults]);

  useEffect(() => {
    localStorage.setItem('cognito_videoRecommendations', JSON.stringify(videoRecommendations));
  }, [videoRecommendations]);

  useEffect(() => {
    localStorage.setItem('cognito_videoSummaries', JSON.stringify(videoSummaries));
  }, [videoSummaries]);

  useEffect(() => {
    localStorage.setItem('cognito_focusSessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'cognito_focusSessions' || !event.newValue) return;

      try {
        const parsed = JSON.parse(event.newValue);
        setFocusSessions(parsed.map((m: any) => ({ ...m, completedAt: new Date(m.completedAt) })));
      } catch (error) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (lastLibrarySyncAt) {
      localStorage.setItem('cognito_lastLibrarySyncAt', lastLibrarySyncAt.toISOString());
      return;
    }
    localStorage.removeItem('cognito_lastLibrarySyncAt');
  }, [lastLibrarySyncAt]);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage = {
      id: uuidv4(),
      content,
      role,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([{ ...WELCOME_MESSAGE, id: uuidv4(), timestamp: new Date() }]);
  };

  const addAnalysisResult = (fileName: string, fileType: string, fileSize: string, analysisData: string[]) => {
    const newResult = {
      id: uuidv4(),
      fileName,
      fileType,
      fileSize,
      analysisData,
      timestamp: new Date(),
    };
    setAnalysisResults((prev) => [...prev, newResult]);
  };

  const addVideoSummary = (videoUrl: string, videoTitle: string | undefined, summary: string) => {
    const newSummary = {
      id: uuidv4(),
      videoUrl,
      videoTitle,
      summary,
      timestamp: new Date(),
    };
    setVideoSummaries((prev) => [...prev, newSummary]);
  };

  const addFocusSession = (task: string, focusMinutes: number, breakMinutes: number) => {
    const session: FocusSession = {
      id: uuidv4(),
      task: task.trim() || 'Deep Work Session',
      focusMinutes,
      breakMinutes,
      completedAt: new Date(),
    };
    setFocusSessions((prev) => [session, ...prev]);
  };

  const clearFocusSessions = () => {
    setFocusSessions([]);
  };

  const setLastLibrarySyncAt = (timestamp: Date | null) => {
    setLastLibrarySyncAtState(timestamp);
  };

  const restoreFromLibraryBackup = (payload: LibraryBackupPayload, mode: 'merge' | 'replace') => {
    const normalizedMessages = (payload.data.messages || []).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    const normalizedAnalysisResults = (payload.data.analysisResults || []).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    const normalizedVideoSummaries = (payload.data.videoSummaries || []).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    const normalizedFocusSessions = (payload.data.focusSessions || []).map((m) => ({
      ...m,
      completedAt: new Date(m.completedAt),
    }));

    if (mode === 'replace') {
      setMessages(normalizedMessages.length ? normalizedMessages : [WELCOME_MESSAGE]);
      setAnalysisResults(normalizedAnalysisResults);
      setVideoRecommendations(payload.data.videoRecommendations || []);
      setVideoSummaries(normalizedVideoSummaries);
      setFocusSessions(normalizedFocusSessions);
      setLastLibrarySyncAtState(new Date());
      return;
    }

    setMessages((prev) => [...prev, ...normalizedMessages]);
    setAnalysisResults((prev) => [...prev, ...normalizedAnalysisResults]);
    setVideoRecommendations((prev) => [...prev, ...(payload.data.videoRecommendations || [])]);
    setVideoSummaries((prev) => [...prev, ...normalizedVideoSummaries]);
    setFocusSessions((prev) => [...normalizedFocusSessions, ...prev]);
    setLastLibrarySyncAtState(new Date());
  };

  return (
    <AppContext.Provider
      value={{
        activeTool,
        setActiveTool,
        isDarkMode,
        toggleTheme,
        messages,
        addMessage,
        clearMessages,
        isTyping,
        setIsTyping,
        analysisResults,
        addAnalysisResult,
        videoRecommendations,
        setVideoRecommendations,
        videoSummaries,
        addVideoSummary,
        focusSessions,
        addFocusSession,
        clearFocusSessions,
        lastLibrarySyncAt,
        setLastLibrarySyncAt,
        restoreFromLibraryBackup,
        prefilledTopic,
        setPrefilledTopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
