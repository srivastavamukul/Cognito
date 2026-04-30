import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface KeyboardShortcutsProps {
  onEscape: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onEscape }) => {
  const { setActiveTool, clearMessages } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + number to switch tools
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setActiveTool('brainstorm');
            break;
          case '2':
            e.preventDefault();
            setActiveTool('focus-flow');
            break;
          case '3':
            e.preventDefault();
            setActiveTool('analyzer');
            break;
          case '4':
            e.preventDefault();
            setActiveTool('video-recommender');
            break;
          case '5':
            e.preventDefault();
            setActiveTool('summarizer');
            break;
          case '6':
            e.preventDefault();
            setActiveTool('library-sync');
            break;
          case 'n':
          case 'N':
            e.preventDefault();
            clearMessages();
            break;
        }
      } else if (e.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool, clearMessages, onEscape]);

  return null;
};

export default KeyboardShortcuts;
