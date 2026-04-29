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
    <div className={`flex gap-6 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'} animate-fadeIn w-full`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isAI ? 'glass-panel text-indigo-400' : 'border border-indigo-500/30'}`}>
        {isAI ? (
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
        ) : (
          <span className="text-white text-xs font-medium">You</span>
        )}
      </div>

      <div className={`glass-panel rounded-2xl p-6 backdrop-blur-[40px] ${isAI ? 'message-bubble-ai rounded-tl-sm' : 'message-bubble-user rounded-tr-sm'}`}>
        {isAI ? (
          <div className="markdown font-body-md text-body-md text-on-surface leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;