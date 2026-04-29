import React, { useState } from 'react';
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
    <div className="flex flex-col h-full p-8 max-w-6xl mx-auto overflow-y-auto w-full">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">Discovery Grid</h2>

      {/* Search bar */}
      <div className="mb-10 w-full max-w-3xl mx-auto">
        <div className="glass-panel rounded-full p-2 pl-6 flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-indigo-500/20 bg-zinc-950/60 transition-all hover:bg-zinc-950/80">
          <span className="material-symbols-outlined text-zinc-400 mr-2">search</span>
          <input
            type="text"
            className="flex-grow bg-transparent border-none text-on-surface font-body-md text-lg focus:ring-0 placeholder-zinc-500 outline-none py-3"
            placeholder="What do you want to master today? e.g. Neural Networks"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`luminescent-button rounded-full py-3 px-8 ml-2 flex items-center justify-center font-label-md text-white transition-all duration-300 ${
              (!topic.trim() || searching) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
            onClick={handleSearch}
            disabled={!topic.trim() || searching}
          >
            {searching ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Searching
              </>
            ) : (
              'Discover'
            )}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {recommendations.length === 0 && !searching && (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center max-w-lg">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center shadow-[0_0_40px_rgba(218,112,214,0.15)]">
                <span className="material-symbols-outlined text-5xl text-orchid-400" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-orchid-400/10 pulse-ring" />
            </div>
            <h3 className="font-headline-md text-xl text-on-surface mb-4">Curated Video Playlists</h3>
            <p className="text-zinc-400 font-body-md mb-6 leading-relaxed">
              Enter any topic and our AI will fetch the most highly-rated, relevant YouTube videos structured logically to accelerate your learning.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setTopic('machine learning fundamentals')} className="glass-panel px-4 py-2 rounded-full text-sm text-indigo-300 hover:bg-white/10 transition-colors">
                Machine Learning
              </button>
              <button onClick={() => setTopic('organic chemistry')} className="glass-panel px-4 py-2 rounded-full text-sm text-orchid-300 hover:bg-white/10 transition-colors">
                Organic Chemistry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="flex-1 pb-12 w-full">
          <h3 className="font-headline-md text-2xl text-white mb-8 text-center">
            Curriculum for <span className="luminescent-text">"{searchedTopic}"</span>
          </h3>

          <div className="space-y-12">
            {recommendations.map((rec, recIndex) => (
              <div key={`${rec.topic}-${rec.subtopic}-${recIndex}`} className="animate-fadeIn">
                <div className="mb-6 flex items-center gap-4 px-2">
                  <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-indigo-400">
                    <span className="material-symbols-outlined">library_books</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-on-surface">{rec.subtopic}</h4>
                    <p className="text-zinc-400 text-sm">{rec.topic}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rec.videos.map((video, vidIndex) => (
                    <a
                      key={vidIndex}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card rounded-3xl p-4 flex flex-col group hover:-translate-y-2 transition-transform duration-300 block"
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-zinc-900">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <span className="material-symbols-outlined text-4xl">movie</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                          <div className="w-14 h-14 rounded-full bg-indigo-500/80 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <h5 className="font-label-md text-on-surface text-base mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                          {video.title}
                        </h5>
                        <p className="font-body-md text-sm text-zinc-500 line-clamp-3 mb-4 flex-grow">
                          {video.description}
                        </p>
                        
                        <div className="flex items-center text-xs font-semibold text-indigo-400 mt-auto uppercase tracking-wide gap-1 group-hover:text-orchid-400 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          Watch Lesson
                        </div>
                      </div>
                    </a>
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