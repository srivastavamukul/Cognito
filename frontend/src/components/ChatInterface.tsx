import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MessageBubble from './MessageBubble';
import { API_BASE_URL } from '../config';

const ChatInterface: React.FC = () => {
  const { messages, addMessage, clearMessages, isTyping, setIsTyping } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, 'user');
    setInput('');
    setIsTyping(true);

    // Build conversation history for context (last 20 messages)
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
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800/60">
        <h2 className="text-sm font-medium text-gray-400">Chat with Cognito</h2>
        <button
          onClick={clearMessages}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="New chat"
        >
          <Plus size={14} />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-gray-400 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">C</span>
              </div>
              <div className="flex space-x-1.5 bg-gray-800 px-4 py-3 rounded-2xl">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800/60 p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            placeholder="Type a message..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`p-3 rounded-xl flex-shrink-0 ${
              input.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            } transition-all duration-200`}
            onClick={handleSendMessage}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;