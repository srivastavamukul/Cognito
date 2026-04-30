import React from 'react';
import { useApp } from '../context/AppContext';
import ChatInterface from './ChatInterface';
import FileAnalyzer from './FileAnalyzer';
import VideoRecommender from './VideoRecommender';
import VideoSummarizer from './VideoSummarizer';
import FocusFlow from './FocusFlow';
import LibrarySync from './LibrarySync';

const MainContent: React.FC = () => {
  const { activeTool } = useApp();

  const renderContent = () => {
    switch (activeTool) {
      case 'brainstorm':
        return <ChatInterface />;
      case 'focus-flow':
        return <FocusFlow />;
      case 'analyzer':
        return <FileAnalyzer />;
      case 'video-recommender':
        return <VideoRecommender />;
      case 'summarizer':
        return <VideoSummarizer />;
      case 'library-sync':
        return <LibrarySync />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-transparent">
      <div key={activeTool} className="h-full overflow-hidden animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainContent;
