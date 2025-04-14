interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  visualizationType: 'waveform' | 'frequency' | 'circular';
  setVisualizationType: (type: 'waveform' | 'frequency' | 'circular') => void;
  colorScheme: 'default' | 'rainbow' | 'monochrome';
  setColorScheme: (scheme: 'default' | 'rainbow' | 'monochrome') => void;
}

export default function VisualizerControls({
  isPlaying,
  onPlayPause,
  onRestart,
  visualizationType,
  setVisualizationType,
  colorScheme,
  setColorScheme
}: VisualizerControlsProps) {
  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 재생 제어 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            aria-label={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <rect x="6" y="4" width="3" height="12" rx="1" />
                <rect x="11" y="4" width="3" height="12" rx="1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          
          <button
            onClick={onRestart}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
            aria-label="다시 시작"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* 시각화 타입 선택 */}
        <div className="flex flex-col">
          <label htmlFor="visualizer-type" className="text-sm font-medium text-gray-700 mb-1">
            시각화 타입
          </label>
          <select
            id="visualizer-type"
            value={visualizationType}
            onChange={(e) => setVisualizationType(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="waveform">파형</option>
            <option value="frequency">주파수</option>
            <option value="circular">원형</option>
          </select>
        </div>

        {/* 색상 스킴 선택 */}
        <div className="flex flex-col">
          <label htmlFor="color-scheme" className="text-sm font-medium text-gray-700 mb-1">
            색상 스킴
          </label>
          <select
            id="color-scheme"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="default">기본</option>
            <option value="rainbow">무지개</option>
            <option value="monochrome">흑백</option>
          </select>
        </div>
      </div>
    </div>
  );
} 