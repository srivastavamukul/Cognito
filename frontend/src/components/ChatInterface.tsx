import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import MessageBubble from './MessageBubble';
import { API_BASE_URL } from '../config';
import { useToast } from '../context/ToastContext';
import { Message } from '../types';

const ChatInterface: React.FC = () => {
  const { messages, addMessage, clearMessages, isTyping, setIsTyping } = useApp();
  const { addToast } = useToast();
  const [input, setInput] = useState('');
  const [brainstormMode, setBrainstormMode] = useState<'clarity' | 'challenge' | 'planner' | 'analogies'>('clarity');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const modePromptMap = {
    clarity: 'Respond with plain language and prioritize conceptual clarity.',
    challenge: 'Act as a critical thinking partner and question weak assumptions.',
    planner: 'Respond with an actionable study plan with steps and checkpoints.',
    analogies: 'Use vivid analogies and memory hooks to explain ideas.',
  };

  const quickPrompts = [
    'Explain this as if I am a beginner.',
    'What assumptions am I making that might be wrong?',
    'Turn this into a 7-day revision plan.',
    'Give me 3 analogies and one mnemonic.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const enrichedUserMessage = `${userMessage}\n\n[Brainstorm mode: ${modePromptMap[brainstormMode]}]`;
    addMessage(userMessage, 'user');
    setInput('');
    setIsTyping(true);

    const conversationHistory = messages
      .filter(m => m.id !== 'welcome')
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }));
    conversationHistory.push({ role: 'user', content: enrichedUserMessage });

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });
      const { reply } = await res.json();
      addMessage(reply, 'assistant');
    } catch (err) {
      console.error(err);
      addMessage('Sorry, I could not connect to the server. Please check that the backend is running.', 'assistant');
      addToast('Failed to connect to AI server', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Optional: Add a top bar for clear messages if needed. Omitting here for clean UI, or floating it */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
        <button
          onClick={() => {
            const text = messages.map(m => `${m.role === 'user' ? 'You' : 'Cognito'} (${m.timestamp?.toLocaleString() || new Date().toLocaleString()}):\n${m.content}`).join('\n\n---\n\n');
            const blob = new Blob([text], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cognito-chat-${new Date().toISOString().split('T')[0]}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addToast('Chat exported to Markdown', 'success');
          }}
          className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-xs text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Export
        </button>
        <button
          onClick={clearMessages}
          className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-xs text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
          Clear
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-grow overflow-y-auto px-container-padding py-section-margin relative z-0 flex flex-col items-center w-full">
        <div className="w-full max-w-4xl flex flex-col gap-8 pb-32">
          {/* Chat Header / Intro */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-panel mb-6 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">AI Brainstorming Session</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Let's synthesize your notes and explore new ideas.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              <button onClick={() => setBrainstormMode('clarity')} className={`rounded-full px-4 py-2 text-sm ${brainstormMode === 'clarity' ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>Clarity</button>
              <button onClick={() => setBrainstormMode('challenge')} className={`rounded-full px-4 py-2 text-sm ${brainstormMode === 'challenge' ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>Challenge</button>
              <button onClick={() => setBrainstormMode('planner')} className={`rounded-full px-4 py-2 text-sm ${brainstormMode === 'planner' ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>Study Plan</button>
              <button onClick={() => setBrainstormMode('analogies')} className={`rounded-full px-4 py-2 text-sm ${brainstormMode === 'analogies' ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>Analogies</button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="glass-panel rounded-full px-3 py-1.5 text-xs text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat History */}
          <div className="flex flex-col gap-6 w-full">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isTyping && (
              <div className="flex gap-6 max-w-[85%] self-start animate-fadeIn w-full">
                <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                </div>
                <div className="glass-panel message-bubble-ai rounded-2xl rounded-tl-sm p-6 backdrop-blur-[40px] flex items-center space-x-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-secondary" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Floating Input Dock */}
      <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center z-20 pointer-events-none">
        <div className="glass-panel pointer-events-auto flex w-full max-w-3xl items-center rounded-full border border-outline/70 bg-surface/80 p-2 pl-6 shadow-[0_10px_40px_rgba(0,0,0,0.22)] transition-all hover:bg-surface-container-low">
          <textarea
            ref={inputRef}
            rows={1}
            className="flex-grow resize-none border-none bg-transparent py-3 font-body-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant focus:ring-0"
            style={{ maxHeight: '120px' }}
            aria-label="Message Cognito"
            placeholder="Explore ideas, ask questions, or paste notes..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={() => addToast('File attachment coming soon!', 'info')}
              className="rounded-full p-3 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
              aria-label="Attach file"
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <button
              onClick={() => addToast('Voice input coming soon!', 'info')}
              className="rounded-full p-3 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-secondary"
              aria-label="Voice input"
            >
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button
              className="luminescent-button ml-2 flex items-center justify-center rounded-full p-3 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSendMessage}
              disabled={!input.trim()}
            >
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
