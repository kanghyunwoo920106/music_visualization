import { useState, useCallback } from 'react';

interface AudioUploaderProps {
  onAudioLoaded: (audioBuffer: AudioBuffer) => void;
}

export default function AudioUploader({ onAudioLoaded }: AudioUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.includes('audio')) {
      setError('오디오 파일만 업로드 가능합니다.');
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      onAudioLoaded(audioBuffer);
    } catch (err) {
      setError('오디오 파일을 처리하는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [onAudioLoaded]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`border-2 border-dashed p-8 rounded-lg text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="audio-file"
          accept="audio/*"
          onChange={handleChange}
          className="hidden"
        />
        <label 
          htmlFor="audio-file"
          className="block cursor-pointer text-gray-700"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
              />
            </svg>
            <span className="text-sm font-medium">
              {fileName ? fileName : '음악 파일을 드래그하거나 클릭하여 업로드하세요'}
            </span>
            <span className="text-xs text-gray-500">MP3, WAV 등 지원</span>
          </div>
        </label>
      </div>

      {loading && (
        <div className="mt-4 text-center text-sm text-blue-600">
          파일을 처리하는 중...
        </div>
      )}

      {error && (
        <div className="mt-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 