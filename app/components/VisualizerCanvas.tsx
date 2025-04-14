import { useEffect, useRef } from 'react';

interface VisualizerCanvasProps {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  isPlaying: boolean;
  visualizationType?: 'waveform' | 'frequency' | 'circular';
  colorScheme?: 'default' | 'rainbow' | 'monochrome';
}

export default function VisualizerCanvas({
  audioContext,
  audioBuffer,
  isPlaying,
  visualizationType = 'waveform',
  colorScheme = 'default'
}: VisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // 색상 설정
  const getColor = (i: number, max: number) => {
    if (colorScheme === 'rainbow') {
      return `hsl(${(i / max) * 360}, 100%, 50%)`;
    } else if (colorScheme === 'monochrome') {
      const brightness = Math.round((i / max) * 100);
      return `rgb(${brightness}%, ${brightness}%, ${brightness}%)`;
    } else {
      // 기본 색상 (파란색 계열)
      return `rgb(0, ${Math.round((i / max) * 255)}, ${255 - Math.round((i / max) * 127)})`;
    }
  };

  // 시각화 시작
  useEffect(() => {
    if (!audioContext || !audioBuffer || !isPlaying || !canvasRef.current) return;

    // 기존 소스 정지
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
    }

    // 오디오 소스 생성
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // 분석기 노드 생성
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    
    // 연결: 소스 -> 분석기 -> 출력
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    source.start(0);
    sourceRef.current = source;
    analyserRef.current = analyser;
    
    // 애니메이션 시작
    renderFrame();

    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioContext, audioBuffer, isPlaying, visualizationType, colorScheme]);

  // 시각화 렌더링
  const renderFrame = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 캔버스 크기 설정
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    const analyser = analyserRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // 배경 지우기
    ctx.clearRect(0, 0, width, height);
    
    // 선택된 시각화 타입에 따라 다른 렌더링 실행
    if (visualizationType === 'waveform') {
      renderWaveform(ctx, analyser, width, height);
    } else if (visualizationType === 'frequency') {
      renderFrequency(ctx, analyser, width, height);
    } else if (visualizationType === 'circular') {
      renderCircular(ctx, analyser, width, height);
    }
    
    // 다음 프레임 요청
    animationRef.current = requestAnimationFrame(renderFrame);
  };
  
  // 파형 시각화
  const renderWaveform = (
    ctx: CanvasRenderingContext2D,
    analyser: AnalyserNode,
    width: number,
    height: number
  ) => {
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = getColor(128, 255);
    ctx.beginPath();
    
    const sliceWidth = width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };
  
  // 주파수 시각화
  const renderFrequency = (
    ctx: CanvasRenderingContext2D,
    analyser: AnalyserNode,
    width: number,
    height: number
  ) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    const barWidth = width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      
      ctx.fillStyle = getColor(dataArray[i], 255);
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth;
    }
  };
  
  // 원형 시각화
  const renderCircular = (
    ctx: CanvasRenderingContext2D,
    analyser: AnalyserNode,
    width: number,
    height: number
  ) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) / 3;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * (radius * 0.8);
      const angle = (i / bufferLength) * Math.PI * 2;
      
      const x1 = center.x + Math.cos(angle) * radius;
      const y1 = center.y + Math.sin(angle) * radius;
      const x2 = center.x + Math.cos(angle) * (radius + barHeight);
      const y2 = center.y + Math.sin(angle) * (radius + barHeight);
      
      ctx.strokeStyle = getColor(dataArray[i], 255);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-black rounded-lg overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
} 