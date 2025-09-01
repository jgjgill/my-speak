# My Speak 디자인 시스템

## 색상 (앱 아이콘 기반)

### 브랜드 색상
- **Primary**: `#1E9AFF` (앱 아이콘 메인 블루)
- **Primary Dark**: `#0070F0` (호버, 액티브 상태)
- **Primary Light**: `#E6F2FF` (배경, 하이라이트)

### 상태 색상
- **성공**: `#10B981` 
- **경고**: `#F59E0B`
- **오류**: `#EF4444`

### 텍스트
- **Primary**: `#1F2937`
- **Secondary**: `#6B7280`
- **Muted**: `#9CA3AF`

## 타이포그래피
- **글꼴**: `system-ui, -apple-system, 'Noto Sans KR', sans-serif`
- **크기**: `16px` (기본), `20px` (제목), `14px` (보조)

## 스페이싱
- **기본**: `16px` (1rem)
- **작음**: `8px` (0.5rem)  
- **큼**: `24px` (1.5rem)
- **매우 큼**: `48px` (3rem)

## 핵심 컴포넌트

### 버튼
```css
/* Primary */
background: #1E9AFF;
color: white;
padding: 12px 24px;
border-radius: 8px;

/* Secondary */
background: white;
color: #1E9AFF;
border: 1px solid #1E9AFF;
```

### 카드
```css
background: white;
border: 1px solid #E5E7EB;
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
```