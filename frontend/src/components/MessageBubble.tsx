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
      <div className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isAI ? 'glass-panel bg-surface text-primary shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]' : 'border border-outline/70 bg-surface-container-low'}`}>
        {isAI ? (
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
        ) : (
          <span className="text-on-surface text-xs font-medium">You</span>
        )}
      </div>

      <div className={`glass-panel rounded-2xl p-6 backdrop-blur-[40px] ${isAI ? 'message-bubble-ai rounded-tl-sm bg-surface shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]' : 'message-bubble-user rounded-tr-sm bg-surface'}`}>
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
