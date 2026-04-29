import React, { useState } from 'react';
import { Search, Video, ExternalLink, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface VideoItem {
  title: string;
  url: string;
  thumbnail: string;
  description: string;
}

interface Recommendation {
  topic: string;
  subtopic: string;
  videos: VideoItem[];
}

const VideoRecommender: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [searching, setSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchedTopic, setSearchedTopic] = useState('');

  const handleSearch = async () => {
    if (!topic.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setSearchedTopic(topic);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Video Recommender</h2>

      {/* Search bar */}
      <div className="mb-6">
        <div className="flex items-center gap-2 max-w-3xl">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full bg-gray-800 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
              placeholder="Enter a topic you want to learn about..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            className={`px-5 py-3 rounded-xl ${
              topic.trim() && !searching
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            } transition-all duration-200 flex items-center gap-2 flex-shrink-0`}
            onClick={handleSearch}
            disabled={!topic.trim() || searching}
          >
            {searching ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {recommendations.length === 0 && !searching && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Video className="w-10 h-10 text-purple-400" />
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-purple-500/10 pulse-ring" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Discover Learning Videos</h3>
            <p className="text-gray-500 text-sm mb-4">
              Enter any topic and get curated YouTube video recommendations matched to your learning needs.
            </p>
            <p className="text-gray-600 text-xs">
              Try: <button onClick={() => setTopic('machine learning fundamentals')} className="text-indigo-400 hover:underline">machine learning fundamentals</button>
              {' or '}
              <button onClick={() => setTopic('neural networks')} className="text-indigo-400 hover:underline">neural networks</button>
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recommended Videos on "<span className="text-indigo-400">{searchedTopic}</span>"
          </h3>

          <div className="space-y-4 max-w-4xl">
            {recommendations.map((rec, recIndex) => (
              <div key={`${rec.topic}-${rec.subtopic}-${recIndex}`} className="bg-gray-800 rounded-xl overflow-hidden animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-700/50">
                  <p className="text-sm font-medium text-white">{rec.subtopic}</p>
                  <p className="text-xs text-gray-500">{rec.topic}</p>
                </div>

                <div className="divide-y divide-gray-700/30">
                  {rec.videos.map((video, vidIndex) => (
                    <div key={vidIndex} className="flex gap-4 p-4 hover:bg-gray-700/20 transition-colors">
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-1 line-clamp-2">{video.title}</p>
                        {video.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mb-2">{video.description}</p>
                        )}
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <Sparkles size={12} />
                          Watch on YouTube
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRecommender;