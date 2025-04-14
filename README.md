# 음악 시각화 도구 (Music Visualization Tool)

Web Audio API와 Canvas를 활용한 음악 시각화 실험 도구입니다. 사용자가 업로드한 음악 파일(MP3, WAV 등)의 오디오 데이터를 분석하여 다양한 시각적 효과로 표현합니다.

![프로젝트 스크린샷](screenshot.png)

## 주요 기능

- **음악 파일 업로드**: 드래그 앤 드롭 또는 파일 선택을 통해 음악 파일 업로드
- **다양한 시각화 모드**:
  - **파형(Waveform)**: 시간에 따른 오디오 파형 표시
  - **주파수(Frequency)**: 주파수 스펙트럼 분석 시각화
  - **원형(Circular)**: 주파수 데이터를 원형으로 시각화
- **색상 스킴 옵션**:
  - **기본(Default)**: 파란색 계열 시각화
  - **무지개(Rainbow)**: 다채로운 색상으로 표현
  - **흑백(Monochrome)**: 흑백 그라데이션으로 표현
- **재생 제어**: 재생/일시정지, 다시 시작 기능

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/) (React 기반)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
- **오디오 처리**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **시각화**: [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 설치 및 실행 방법

### 요구 사항

- [Node.js](https://nodejs.org/) (v18 이상)
- [npm](https://www.npmjs.com/) 또는 [pnpm](https://pnpm.io/)

### 설치

1. 저장소 클론:
   ```bash
   git clone https://github.com/사용자이름/music_visualization.git
   cd music_visualization
   ```

2. 의존성 설치:
   ```bash
   # npm 사용 시
   npm install
   
   # pnpm 사용 시
   pnpm install
   ```

### 개발 서버 실행

```bash
# npm 사용 시
npm run dev

# pnpm 사용 시
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션에 접속합니다.

### 프로덕션 빌드

```bash
# npm 사용 시
npm run build
npm start

# pnpm 사용 시
pnpm build
pnpm start
```

## 프로젝트 구조

```
music_visualization/
├── app/                    # Next.js 앱 디렉토리
│   ├── components/         # 컴포넌트 폴더
│   │   ├── AudioUploader.tsx      # 오디오 파일 업로드 컴포넌트
│   │   ├── VisualizerCanvas.tsx   # 시각화 캔버스 컴포넌트
│   │   └── VisualizerControls.tsx # 재생 및 시각화 제어 컴포넌트
│   ├── globals.css         # 전역 스타일
│   ├── layout.tsx          # 레이아웃 컴포넌트
│   └── page.tsx            # 메인 페이지
├── public/                 # 정적 파일
├── package.json            # 프로젝트 의존성 및 스크립트
└── tsconfig.json           # TypeScript 설정
```

## 사용 방법

1. 메인 페이지에서 음악 파일을 업로드합니다 (드래그 앤 드롭 또는 클릭하여 선택).
2. 파일이 로드되면 재생 버튼을 눌러 음악과 시각화를 시작합니다.
3. 시각화 타입과 색상 스킴을 원하는 대로 변경하며 다양한 시각화 효과를 경험합니다.
4. 일시정지 및 다시 시작 버튼으로 재생을 제어할 수 있습니다.

## 브라우저 호환성

이 프로젝트는 Web Audio API와 Canvas API를 사용하므로 최신 버전의 웹 브라우저가 필요합니다:
- Chrome (권장)
- Firefox
- Safari
- Edge

## 기여하기

프로젝트 개선에 기여하고 싶으시다면:
1. 이 저장소를 포크합니다.
2. 새 브랜치를 만듭니다: `git checkout -b feature/amazing-feature`
3. 변경사항을 커밋합니다: `git commit -m '새로운 기능 추가'`
4. 브랜치를 푸시합니다: `git push origin feature/amazing-feature`
5. Pull Request를 생성합니다.

## 라이선스

[MIT 라이선스](LICENSE) 하에 배포됩니다.

## 감사의 말

- Web Audio API와 Canvas API 문서 및 튜토리얼
- Next.js 및 React 커뮤니티
- Tailwind CSS 팀
