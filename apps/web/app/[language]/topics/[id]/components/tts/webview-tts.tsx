"use client";

interface WebViewTTSProps {
	text: string;
	language?: string;
	onSpeakStart?: () => void;
	onSpeakEnd?: () => void;
	onError?: (error: string) => void;
}

export default function WebViewTTS({
	text,
	language = "en-US",
	onSpeakStart,
	onSpeakEnd,
	onError,
}: WebViewTTSProps) {
	// TODO: 향후 네이티브 앱과의 브릿지 통신으로 TTS 구현
	// 현재는 임시로 지원되지 않는 상태로 표시
	return (
		<div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
			<span className="text-orange-400">🔊</span>
			<span className="text-sm text-orange-600">WebView TTS 준비 중</span>
		</div>
	);
}