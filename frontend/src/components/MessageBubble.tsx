import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === 'assistant';

  return (
    <div
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-fadeIn`}
    >
      <div className={`flex items-start gap-3 ${isAI ? 'max-w-[85%]' : 'max-w-[75%]'}`}>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center mt-1">
            <span className="text-white text-xs font-medium">C</span>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 ${
            isAI
              ? 'bg-gray-800 text-gray-200'
              : 'bg-indigo-600 text-white'
          }`}
        >
          {isAI ? (
            <div className="markdown text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
          )}
          <div className={`text-xs mt-2 ${isAI ? 'text-gray-500' : 'text-indigo-200'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center mt-1">
            <span className="text-white text-xs font-medium">You</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;