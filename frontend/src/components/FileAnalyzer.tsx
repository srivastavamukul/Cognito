import React, { useState, useRef } from 'react';
import { Upload, File, X, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config';

const FileAnalyzer: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
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
      setError('Only CSV files are supported. Please upload a .csv file.');
      return;
    }
    setSelectedFile(file);
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
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!selectedFile) return;
    setAnalyzing(true);
    setError('');

    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', selectedFile);
      cloudinaryFormData.append('upload_preset', uploadPreset);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: 'POST', body: cloudinaryFormData }
      );

      if (!cloudinaryRes.ok) throw new Error('Failed to upload file.');

      const cloudinaryData = await cloudinaryRes.json();
      const uploadedUrl = cloudinaryData.secure_url;

      const backendRes = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadedUrl }),
      });

      if (!backendRes.ok) throw new Error('Backend analysis failed.');

      const analysis = await backendRes.json();

      setAnalysisResults((prev) => [
        ...prev,
        {
          id: Date.now(),
          fileName: selectedFile.name,
          fileType: analysis.fileType || selectedFile.type,
          fileSize: formatFileSize(selectedFile.size),
          analysisData: analysis.analysis1?.join(', ') || 'No weak topics found.',
          timestamp: new Date(),
        },
      ]);
      removeFile();
    } catch (err: any) {
      console.error('Upload or analysis failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">File Analyzer</h2>

      {/* Drop zone */}
      <div className="max-w-3xl">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all duration-200 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-gray-700 hover:border-gray-600'
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
          <Upload className="w-10 h-10 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-300 mb-1">Drag and drop your CSV file here, or</p>
          <p className="text-gray-500 text-sm mb-4">Supports .csv files with student performance data</p>
          <button
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Selected file */}
        {selectedFile && (
          <div className="bg-gray-800 rounded-xl p-4 mb-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <File className="text-indigo-400" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-gray-500 text-xs">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-300 transition-colors" onClick={removeFile}>
                <X size={18} />
              </button>
            </div>

            <button
              className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-indigo-600/20"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <FileText className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-emerald-500/10 pulse-ring" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analyze Your Performance</h3>
            <p className="text-gray-500 text-sm">
              Upload a CSV file with your test results. The AI will identify your weak topics so you know exactly what to study next.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {analysisResults.length > 0 && (
        <div className="flex-1 overflow-y-auto mt-4">
          <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>

          <div className="space-y-4 max-w-3xl">
            {analysisResults.map((result) => (
              <div key={result.id} className="bg-gray-800 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <File className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{result.fileName}</p>
                    <p className="text-gray-500 text-xs">{result.fileType} - {result.fileSize}</p>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-3 text-gray-300 text-sm">
                  <span className="text-gray-500 font-medium">Weak Topics: </span>
                  {result.analysisData}
                </div>

                <p className="text-gray-600 text-xs mt-2">
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
