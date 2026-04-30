import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../config';
import { useToast } from '../context/ToastContext';
import { VideoSummary } from '../types';

const VideoSummarizer: React.FC = () => {
  const { videoSummaries, addVideoSummary } = useApp();
  const [videoUrl, setVideoUrl] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const isValidYoutubeUrl = (url: string): boolean => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return pattern.test(url);
  };

  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSummarize = async () => {
    if (!isValidYoutubeUrl(videoUrl)) {
      const msg = 'Please enter a valid YouTube video URL (e.g. youtube.com/watch?v=... or youtu.be/...)';
      setError(msg);
      addToast(msg, 'warning');
      return;
    }
    setError('');
    setSummarizing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to summarize.');
      }

      const data = await res.json();
      if (!data.summary) {
        throw new Error('Summary is missing in the response.');
      }
      const videoId = getYoutubeVideoId(videoUrl);
      addVideoSummary(videoUrl, data.title || videoId || 'Video Summary', data.summary);
      setVideoUrl('');
      addToast('Summary generated successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Failed to summarize. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSummarizing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSummarize();
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-5xl mx-auto overflow-y-auto w-full">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">Video Summarizer</h2>

      {/* Input */}
      <div className="mb-10 w-full max-w-3xl mx-auto">
        <div className="glass-panel rounded-3xl border border-outline/70 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all hover:bg-surface-container-low/70">
          <div className={`glass-card relative mb-6 flex items-center rounded-full p-2 pl-6 transition-all ${
            error ? 'border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border border-outline/70'
          }`}>
            <span className="material-symbols-outlined mr-2 text-on-surface-variant">movie</span>
            <input
              type="text"
              className="flex-grow border-none bg-transparent py-2 font-body-md text-on-surface outline-none placeholder:text-on-surface-variant focus:ring-0"
              aria-label="YouTube video URL"
              placeholder="Paste YouTube video URL here..."
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-6 text-center">{error}</p>}

          <button
            aria-label={summarizing ? 'Summarizing video' : 'Start video summarization'}
            className={`w-full py-4 rounded-full font-label-md text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              videoUrl.trim() && !summarizing
                ? 'luminescent-button hover:scale-[1.02]'
                : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed border border-white/5'
            }`}
            onClick={handleSummarize}
            disabled={!videoUrl.trim() || summarizing}
          >
            {summarizing ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Processing Video...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                Extract Key Concepts
              </>
            )}
          </button>

          {summarizing && (
            <p className="text-indigo-300 text-xs text-center mt-4 animate-pulse">This may take 30-60 seconds depending on video length...</p>
          )}
        </div>
      </div>

      {/* Empty state */}
      {videoSummaries.length === 0 && !summarizing && (
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="text-center max-w-lg">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center shadow-[0_0_40px_rgba(251,171,255,0.15)]">
                <span className="material-symbols-outlined text-5xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-secondary/10 pulse-ring" />
            </div>
            <h3 className="font-headline-md text-xl text-on-surface mb-3">Distill Long Lectures</h3>
            <p className="text-zinc-400 font-body-md leading-relaxed">
              Paste a YouTube URL and our AI will synthesize the core arguments, definitions, and formulas into an easily digestible study guide.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {videoSummaries.length > 0 && (
        <div className="flex-1 w-full pb-12">
          <h3 className="font-headline-md text-2xl text-on-surface mb-8 text-center">Generated Summaries</h3>

          <div className="space-y-8 max-w-4xl mx-auto">
            {[...videoSummaries].reverse().map((summary: VideoSummary) => {
              const videoId = getYoutubeVideoId(summary.videoUrl);

              return (
                <div key={summary.id} className="glass-card rounded-3xl p-6 md:p-8 animate-fadeIn hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-white/5">
                    {videoId && (
                      <div className="md:w-1/3 flex-shrink-0">
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.3)] bg-zinc-900 relative group">
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={summary.videoTitle || 'YouTube Thumbnail'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                            }}
                          />
                          <a
                            href={summary.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
                          >
                             <div className="w-12 h-12 rounded-full bg-rose-500/80 flex items-center justify-center text-white">
                               <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                             </div>
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="md:w-2/3 flex flex-col justify-center">
                      <h4 className="font-headline-md text-xl text-on-surface mb-2">
                        {summary.videoTitle || 'Video Summary'}
                      </h4>
                      <p className="text-zinc-500 text-sm font-body-md mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {summary.timestamp.toLocaleString()}
                      </p>
                      <a
                        href={summary.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-400 font-label-md text-sm hover:text-indigo-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        Open Original Video
                      </a>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                      </div>
                      <h5 className="font-label-md text-lg text-white">Core Insights</h5>
                    </div>
                    <div className="text-zinc-300 whitespace-pre-wrap markdown font-body-md leading-relaxed text-sm">
                      {summary.summary}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSummarizer;
