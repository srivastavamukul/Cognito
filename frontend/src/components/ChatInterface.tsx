import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import MessageBubble from './MessageBubble';
import { API_BASE_URL } from '../config';

const ChatInterface: React.FC = () => {
  const { messages, addMessage, clearMessages, isTyping, setIsTyping } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, 'user');
    setInput('');
    setIsTyping(true);

    const conversationHistory = messages
      .filter(m => m.id !== 'welcome')
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }));
    conversationHistory.push({ role: 'user', content: userMessage });

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
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Optional: Add a top bar for clear messages if needed. Omitting here for clean UI, or floating it */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={clearMessages}
          className="glass-panel px-4 py-2 rounded-full text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
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
              <span className="material-symbols-outlined text-4xl text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">AI Brainstorming Session</h2>
            <p className="font-body-lg text-body-lg text-zinc-400 max-w-2xl mx-auto">Let's synthesize your notes and explore new ideas.</p>
          </div>

          {/* Chat History */}
          <div className="flex flex-col gap-6 w-full">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isTyping && (
              <div className="flex gap-6 max-w-[85%] self-start animate-fadeIn w-full">
                <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-indigo-400 text-sm">auto_awesome</span>
                </div>
                <div className="glass-panel message-bubble-ai rounded-2xl rounded-tl-sm p-6 backdrop-blur-[40px] flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-orchid-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Floating Input Dock */}
      <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center z-20 pointer-events-none">
        <div className="w-full max-w-3xl glass-panel rounded-full p-2 pl-6 flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] pointer-events-auto border border-indigo-500/20 bg-zinc-950/60 transition-all hover:bg-zinc-950/80">
          <input
            ref={inputRef}
            className="flex-grow bg-transparent border-none text-on-surface font-body-md text-body-md focus:ring-0 placeholder-zinc-500 outline-none"
            placeholder="Explore ideas, ask questions, or paste notes..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2 pr-2">
            <button className="p-3 rounded-full text-zinc-400 hover:text-indigo-400 hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <button className="p-3 rounded-full text-zinc-400 hover:text-orchid-400 hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button
              className="luminescent-button rounded-full p-3 ml-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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