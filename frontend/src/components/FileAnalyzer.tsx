import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../config';
import { useToast } from '../context/ToastContext';
import { AnalysisResult } from '../types';

const FileAnalyzer: React.FC = () => {
  const { setActiveTool, analysisResults, addAnalysisResult, setPrefilledTopic } = useApp();
  const { addToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError('');
    if (!file.name.endsWith('.csv')) {
      const msg = 'Only CSV files are supported. Please upload a .csv file.';
      setError(msg);
      addToast(msg, 'warning');
      return;
    }
    setSelectedFile(file);
    addToast('File selected successfully', 'success');
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const backendRes = await fetch(`${API_BASE_URL}/api/analyze/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!backendRes.ok) throw new Error('Backend analysis failed.');

      const analysis = await backendRes.json();

      addAnalysisResult(
        selectedFile.name,
        analysis.fileType || selectedFile.type,
        formatFileSize(selectedFile.size),
        analysis.analysis1 || []
      );

      addToast('Analysis complete!', 'success');
      removeFile();
    } catch (err: any) {
      console.error('Analysis failed:', err);
      const msg = err.message || 'Analysis failed. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const navigateToVideoRecommender = (topic: string) => {
    setPrefilledTopic(topic);
    setActiveTool('video-recommender');
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-5xl mx-auto overflow-y-auto w-full">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">File Analyzer</h2>

      {/* Drop zone */}
      <div className="max-w-3xl w-full mx-auto">
        <div
          className={`glass-panel rounded-3xl p-10 text-center mb-8 transition-all duration-300 border-2 ${dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-transparent hover:border-white/10 hover:bg-white/5'
            }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-indigo-400">upload_file</span>
          </div>
          <p className="font-body-md text-on-surface mb-2 text-lg">Drag and drop your CSV file here, or</p>
          <p className="text-zinc-500 text-sm mb-6">Supports .csv files with student performance data</p>
          <button
            aria-label="Browse for CSV file"
            className="luminescent-button px-6 py-3 text-white rounded-full transition-colors text-sm font-label-md"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-6 text-center">{error}</p>}

        {/* Selected file */}
        {selectedFile && (
          <div className="glass-card rounded-3xl p-6 mb-8 animate-fadeIn max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-400">csv</span>
                </div>
                <div>
                  <p className="text-on-surface font-label-md">{selectedFile.name}</p>
                  <p className="text-zinc-500 text-sm">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                aria-label="Remove selected file"
                className="text-zinc-500 hover:text-rose-400 transition-colors p-2"
                onClick={removeFile}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <button
              aria-label={analyzing ? 'Analyzing file' : 'Start file analysis'}
              className="w-full mt-6 py-3 luminescent-button text-white rounded-full transition-all duration-200 flex items-center justify-center gap-2 font-label-md"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                'Analyze File'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {analysisResults.length === 0 && !selectedFile && (
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="text-center max-w-md">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <span className="material-symbols-outlined text-5xl text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              </div>
            </div>
            <h3 className="font-headline-md text-on-surface mb-3 text-xl">Analyze Your Performance</h3>
            <p className="text-zinc-400 font-body-md">
              Upload a CSV file with your test results. The AI will identify your weak topics so you know exactly what to study next.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {analysisResults.length > 0 && (
        <div className="flex-1 mt-8 max-w-5xl w-full mx-auto">
          <h3 className="font-headline-md text-on-surface mb-6 text-xl px-2">Analysis Insights</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...analysisResults].reverse().map((result: AnalysisResult) => (
              <div key={result.id} className="glass-card rounded-3xl p-6 animate-fadeIn hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4 border-b border-white/5 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-400">insert_drive_file</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-label-md text-base">{result.fileName}</p>
                    <p className="text-zinc-500 text-xs mt-1">{result.fileType} • {result.fileSize}</p>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-4 text-zinc-300 font-body-md text-sm leading-relaxed">
                  <span className="text-emerald-400 font-semibold block mb-4">Needs Attention:</span>
                  <div className="flex flex-wrap gap-3">
                    {result.analysisData.length > 0 ? (
                      result.analysisData.map((topic: string, index: number) => (
                        <div key={index} className="flex items-center justify-between w-full bg-white/5 rounded-xl p-3 border border-white/5">
                          <span className="font-semibold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-400 text-sm">warning</span>
                            {topic}
                          </span>
                          <button
                            aria-label={`Recommend videos for ${topic}`}
                            onClick={() => navigateToVideoRecommender(topic)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">smart_display</span>
                            Recommend Videos
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No weak topics found. Great job!</p>
                    )}
                  </div>
                </div>

                <p className="text-zinc-600 text-xs mt-4 px-1">
                  Analyzed on {result.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAnalyzer;
