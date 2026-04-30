export type ToolType =
  | 'brainstorm'
  | 'focus-flow'
  | 'analyzer'
  | 'video-recommender'
  | 'summarizer'
  | 'library-sync';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  analysisData: string[];
  timestamp: Date;
}

export interface VideoItem {
  title: string;
  url: string;
  thumbnail: string;
  description: string;
}

export interface VideoRecommendation {
  topic: string;
  subtopic: string;
  videos: VideoItem[];
}

export interface VideoSummary {
  id: string;
  videoUrl: string;
  videoTitle?: string;
  summary: string;
  timestamp: Date;
}

export type FocusPhase = 'focus' | 'break';

export interface FocusSession {
  id: string;
  task: string;
  focusMinutes: number;
  breakMinutes: number;
  completedAt: Date;
}

export interface LibraryBackupPayload {
  version: number;
  exportedAt: string;
  data: {
    messages: Message[];
    analysisResults: AnalysisResult[];
    videoRecommendations: VideoRecommendation[];
    videoSummaries: VideoSummary[];
    focusSessions: FocusSession[];
  };
}
