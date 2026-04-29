import React, { useState } from 'react';
import { Youtube, FileText, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../config';

const VideoSummarizer: React.FC = () => {
  const { videoSummaries, addVideoSummary } = useApp();
  const [videoUrl, setVideoUrl] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState('');

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
      setError('Please enter a valid YouTube video URL (e.g. youtube.com/watch?v=... or youtu.be/...)');
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to summarize. Please try again.');
    } finally {
      setSummarizing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSummarize();
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Video Summarizer</h2>

      {/* Input */}
      <div className="mb-6 max-w-3xl">
        <div className="relative mb-3">
          <input
            type="text"
            className={`w-full bg-gray-800 text-white rounded-xl pl-10 pr-4 py-3 outline-none transition-shadow ${
              error ? 'ring-2 ring-red-500/50' : 'focus:ring-2 focus:ring-indigo-500/50'
            }`}
            placeholder="Paste YouTube video URL..."
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
          />
          <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          className={`w-full px-4 py-3 rounded-xl ${
            videoUrl.trim() && !summarizing
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          } transition-all duration-200 flex items-center justify-center gap-2`}
          onClick={handleSummarize}
          disabled={!videoUrl.trim() || summarizing}
        >
          {summarizing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Generating Summary...
            </>
          ) : (
            'Summarize Video'
          )}
        </button>

        {summarizing && (
          <p className="text-gray-500 text-xs text-center mt-2">This may take 30-60 seconds depending on video length.</p>
        )}
      </div>

      {/* Empty state */}
      {videoSummaries.length === 0 && !summarizing && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                <Youtube className="w-10 h-10 text-rose-400" />
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-rose-500/10 pulse-ring" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Summarize Any YouTube Video</h3>
            <p className="text-gray-500 text-sm">
              Paste a YouTube URL above and get a concise, AI-generated summary. Study the key points without re-watching the whole video.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {videoSummaries.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Video Summaries</h3>

          <div className="space-y-6 max-w-4xl">
            {videoSummaries.map((summary) => {
              const videoId = getYoutubeVideoId(summary.videoUrl);

              return (
                <div key={summary.id} className="bg-gray-800 rounded-xl p-4 animate-fadeIn">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {videoId && (
                      <div className="md:w-1/3">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={summary.videoTitle || 'YouTube Thumbnail'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="md:w-2/3">
                      <h4 className="text-lg font-semibold text-white">
                        {summary.videoTitle || 'Video Summary'}
                      </h4>
                      <a
                        href={summary.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 text-sm hover:underline mt-1 inline-block"
                      >
                        {summary.videoUrl}
                      </a>
                      <p className="text-gray-500 text-sm mt-2">
                        Summarized on {summary.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="text-indigo-400" size={18} />
                      <h5 className="text-white font-medium">Summary</h5>
                    </div>
                    <div className="text-gray-300 whitespace-pre-wrap markdown text-sm leading-relaxed">
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