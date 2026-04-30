import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { LibraryBackupPayload } from '../types';

const LibrarySync: React.FC = () => {
  const {
    messages,
    analysisResults,
    videoRecommendations,
    videoSummaries,
    focusSessions,
    lastLibrarySyncAt,
    setLastLibrarySyncAt,
    restoreFromLibraryBackup,
  } = useApp();
  const { addToast } = useToast();
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => {
    const recommendationItems = videoRecommendations.reduce((total, rec) => total + rec.videos.length, 0);
    return {
      messages: messages.length,
      analysisResults: analysisResults.length,
      recommendationItems,
      summaries: videoSummaries.length,
      focusSessions: focusSessions.length,
    };
  }, [messages, analysisResults, videoRecommendations, videoSummaries, focusSessions]);

  const handleExport = () => {
    const payload: LibraryBackupPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        messages,
        analysisResults,
        videoRecommendations,
        videoSummaries,
        focusSessions,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognito-library-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLastLibrarySyncAt(new Date());
    addToast('Library backup exported successfully.', 'success');
  };

  const handleImportFile = async (file: File) => {
    setSyncing(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as LibraryBackupPayload;
      if (!parsed?.data) {
        throw new Error('Invalid backup format.');
      }

      restoreFromLibraryBackup(parsed, importMode);
      setLastLibrarySyncAt(new Date());
      addToast(importMode === 'merge' ? 'Library merged from backup.' : 'Library replaced from backup.', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to import backup.', 'error');
    } finally {
      setSyncing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-5xl mx-auto overflow-y-auto w-full">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">Sync Your Library</h2>

      <div className="glass-card rounded-3xl p-8 mb-6">
        <h3 className="font-headline-md text-on-surface text-xl mb-2">Study Vault Overview</h3>
        <p className="text-zinc-400 mb-6">Export all learning artifacts into one backup file, or import to restore your workspace.</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="glass-panel rounded-2xl p-4 text-center"><p className="text-indigo-300 text-2xl font-bold">{totals.messages}</p><p className="text-zinc-500 text-xs">Chat Messages</p></div>
          <div className="glass-panel rounded-2xl p-4 text-center"><p className="text-indigo-300 text-2xl font-bold">{totals.analysisResults}</p><p className="text-zinc-500 text-xs">Analyses</p></div>
          <div className="glass-panel rounded-2xl p-4 text-center"><p className="text-indigo-300 text-2xl font-bold">{totals.recommendationItems}</p><p className="text-zinc-500 text-xs">Video Recs</p></div>
          <div className="glass-panel rounded-2xl p-4 text-center"><p className="text-indigo-300 text-2xl font-bold">{totals.summaries}</p><p className="text-zinc-500 text-xs">Summaries</p></div>
          <div className="glass-panel rounded-2xl p-4 text-center"><p className="text-indigo-300 text-2xl font-bold">{totals.focusSessions}</p><p className="text-zinc-500 text-xs">Focus Runs</p></div>
        </div>

        <p className="text-zinc-500 text-sm mt-4">
          Last sync: {lastLibrarySyncAt ? lastLibrarySyncAt.toLocaleString() : 'Not synced yet'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6">
          <h4 className="text-on-surface text-lg font-semibold mb-2">Export Backup</h4>
          <p className="text-zinc-400 text-sm mb-4">Download a complete JSON backup of all your Cognito learning data.</p>
          <button onClick={handleExport} className="luminescent-button px-6 py-3 rounded-full text-white">
            Export Library
          </button>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h4 className="text-on-surface text-lg font-semibold mb-2">Import Backup</h4>
          <p className="text-zinc-400 text-sm mb-4">Restore from a JSON backup with merge or replace mode.</p>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setImportMode('merge')} className={`px-4 py-2 rounded-full text-sm ${importMode === 'merge' ? 'bg-indigo-500/20 text-indigo-300' : 'glass-panel text-zinc-300'}`}>Merge</button>
            <button onClick={() => setImportMode('replace')} className={`px-4 py-2 rounded-full text-sm ${importMode === 'replace' ? 'bg-rose-500/20 text-rose-300' : 'glass-panel text-zinc-300'}`}>Replace</button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={syncing}
            className="glass-panel px-6 py-3 rounded-full text-white disabled:opacity-60"
          >
            {syncing ? 'Importing...' : 'Import Library Backup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibrarySync;
