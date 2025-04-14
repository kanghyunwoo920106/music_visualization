'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import AudioUploader from '@/app/components/AudioUploader';
import VisualizerCanvas from '@/app/components/VisualizerCanvas';
import VisualizerControls from '@/app/components/VisualizerControls';

export default function Home() {
  // 상태 관리
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizationType, setVisualizationType] = useState<'waveform' | 'frequency' | 'circular'>('waveform');
  const [colorScheme, setColorScheme] = useState<'default' | 'rainbow' | 'monochrome'>('default');
  
  // AudioContext 관리
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  
  // AudioContext 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 오디오 파일 로드 처리
  const handleAudioLoaded = useCallback((newAudioBuffer: AudioBuffer) => {
    setAudioBuffer(newAudioBuffer);
    setIsPlaying(false);
  }, []);

  // 재생/일시정지 토글
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // 다시 시작
  const handleRestart = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      // 약간의 지연 후 다시 재생 시작
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">음악 시각화 도구</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            음악 파일을 업로드하여 실시간으로 아름다운 시각화를 경험하세요
          </p>
        </header>

        <div className="space-y-8">
          {/* 파일 업로드 섹션 */}
          <section className="glass-card rounded-2xl overflow-hidden custom-shadow">
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                음악 파일 업로드
              </h2>
              <AudioUploader onAudioLoaded={handleAudioLoaded} />
            </div>
          </section>

          {/* 시각화 섹션 (오디오 파일이 로드된 경우에만 표시) */}
          {audioBuffer && (
            <>
              {/* 재생 컨트롤 */}
              <section className="glass-card rounded-2xl overflow-hidden custom-shadow">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 01-.707-7.07m-2.122 9.9a9 9 0 010-12.73" />
                    </svg>
                    시각화 설정
                  </h2>
                  <VisualizerControls
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onRestart={handleRestart}
                    visualizationType={visualizationType}
                    setVisualizationType={setVisualizationType}
                    colorScheme={colorScheme}
                    setColorScheme={setColorScheme}
                  />
                </div>
              </section>

              {/* 시각화 캔버스 */}
              <section className="rounded-2xl overflow-hidden custom-shadow">
                <div className="visualizer-bg p-6 border border-gray-800">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    음악 시각화
                  </h2>
                  <div className="h-[500px] pulse-effect rounded-xl overflow-hidden border border-gray-700">
                    <VisualizerCanvas
                      audioContext={audioContextRef.current}
                      audioBuffer={audioBuffer}
                      isPlaying={isPlaying}
                      visualizationType={visualizationType}
                      colorScheme={colorScheme}
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {/* 사용 방법 안내 */}
          <section className="glass-card rounded-2xl overflow-hidden custom-shadow">
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                사용 방법
              </h2>
              <ol className="list-none pl-0 space-y-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-medium">1</span>
                  <span>위 섹션에서 음악 파일을 업로드하세요 (MP3, WAV 등 오디오 파일)</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-medium">2</span>
                  <span>시각화 타입과 색상 스킴을 선택하세요</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-medium">3</span>
                  <span>재생 버튼을 눌러 시각화를 시작하세요</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-6 h-6 mr-3 mt-0.5 text-sm font-medium">4</span>
                  <span>다양한 시각화 옵션을 실험해보세요</span>
                </li>
              </ol>
            </div>
          </section>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm py-8 border-t border-gray-200 dark:border-gray-800">
          <p>Web Audio API와 Canvas로 구현된 음악 시각화 도구</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://github.com/사용자이름/music_visualization" className="hover:text-indigo-600 transition-colors" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
