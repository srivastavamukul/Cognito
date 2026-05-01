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
          <div className="flex flex-col gap-3">
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            {message.attachment && (
              <div className="mt-2 rounded-lg overflow-hidden border border-outline/30 bg-surface-container-high/20">
                {message.attachment.type === 'image' ? (
                  <img 
                    src={message.attachment.url} 
                    alt={message.attachment.name} 
                    className="max-w-full h-auto object-cover max-h-60 rounded-md"
                  />
                ) : (
                  <a 
                    href={message.attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 text-sm text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">description</span>
                    {message.attachment.name}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
