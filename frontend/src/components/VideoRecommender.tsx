import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../config';
import { VideoRecommendation } from '../types';

const VideoRecommender: React.FC = () => {
  const { prefilledTopic, setPrefilledTopic, videoRecommendations, setVideoRecommendations } = useApp();
  const [topic, setTopic] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedTopic, setSearchedTopic] = useState('');

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchQuery }),
      });
      const data = await res.json();
      setVideoRecommendations(data.recommendations || []);
      setSearchedTopic(searchQuery);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }, [setVideoRecommendations]);

  useEffect(() => {
    if (prefilledTopic) {
      setTopic(prefilledTopic);
      handleSearch(prefilledTopic);
      setPrefilledTopic(''); // Clear it so it doesn't re-trigger
    }
  }, [prefilledTopic, setPrefilledTopic, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(topic);
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-6xl mx-auto overflow-y-auto w-full">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">Discovery Grid</h2>

      {/* Search bar */}
      <div className="mb-10 w-full max-w-3xl mx-auto">
        <div className="glass-panel flex items-center rounded-full border border-outline/70 bg-surface/80 p-2 pl-6 shadow-[0_10px_40px_rgba(0,0,0,0.22)] transition-all hover:bg-surface-container-low">
          <span className="material-symbols-outlined mr-2 text-on-surface-variant">search</span>
          <input
            type="text"
            className="flex-grow border-none bg-transparent py-3 font-body-md text-lg text-on-surface outline-none placeholder:text-on-surface-variant focus:ring-0"
            aria-label="Search topics"
            placeholder="What do you want to master today? e.g. Neural Networks"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            aria-label={searching ? 'Searching for videos' : 'Search for video recommendations'}
            className={`luminescent-button rounded-full py-3 px-8 ml-2 flex items-center justify-center font-label-md text-white transition-all duration-300 ${
              (!topic.trim() || searching) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
            onClick={() => handleSearch(topic)}
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
      {videoRecommendations.length === 0 && !searching && (
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
              <button onClick={() => { setTopic('machine learning fundamentals'); handleSearch('machine learning fundamentals'); }} className="glass-panel px-4 py-2 rounded-full text-sm text-indigo-300 hover:bg-white/10 transition-colors">
                Machine Learning
              </button>
              <button onClick={() => { setTopic('organic chemistry'); handleSearch('organic chemistry'); }} className="glass-panel px-4 py-2 rounded-full text-sm text-orchid-300 hover:bg-white/10 transition-colors">
                Organic Chemistry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {videoRecommendations.length > 0 && (
        <div className="flex-1 pb-12 w-full">
          <h3 className="font-headline-md text-2xl text-white mb-8 text-center">
            Curriculum {searchedTopic && <span>for <span className="luminescent-text">"{searchedTopic}"</span></span>}
          </h3>

          <div className="space-y-12">
            {videoRecommendations.map((rec: VideoRecommendation, recIndex: number) => (
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
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/85 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
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
