"use client";

import { useEffect, useRef, useState } from "react";
import { useBooleanState } from "react-simplikit";

interface BrowserTTSProps {
	text: string;
	language?: string;
	onSpeakStart?: () => void;
	onSpeakEnd?: () => void;
	onError?: (error: string) => void;
}

export default function BrowserTTS({
	text,
	language = "en",
	onSpeakStart,
	onSpeakEnd,
	onError,
}: BrowserTTSProps) {
	const [isPlaying, playTts, pauseTts] = useBooleanState(false);

	const [isSupported, setIsSupported] = useState(true);
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	useEffect(() => {
		if (!("speechSynthesis" in window)) {
			setIsSupported(false);
		}
	}, []);

	useEffect(() => {
		return () => {
			if (utteranceRef.current && speechSynthesis.speaking) {
				speechSynthesis.cancel();
			}
		};
	}, []);

	const speak = () => {
		if (!text.trim() || !isSupported) return;

		// 기존 음성 재생 중지
		speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utteranceRef.current = utterance;

		// 언어 설정
		utterance.lang = language;
		utterance.rate = 1.0;
		utterance.pitch = 1.0;
		utterance.volume = 1.0;

		// 이벤트 핸들러 설정
		utterance.onstart = () => {
			playTts();
			onSpeakStart?.();
		};

		utterance.onend = () => {
			pauseTts();
			onSpeakEnd?.();
			utteranceRef.current = null;
		};

		utterance.onerror = (event) => {
			pauseTts();
			onError?.(event.error);
			utteranceRef.current = null;
		};

		// 음성 재생 시작
		speechSynthesis.speak(utterance);
	};

	const stop = () => {
		speechSynthesis.cancel();
		pauseTts();
		utteranceRef.current = null;
	};

	if (!isSupported) {
		return (
			<div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
				<span className="text-gray-400">🔊</span>
				<span className="text-sm text-gray-500">음성 재생 미지원</span>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={isPlaying ? stop : speak}
			disabled={!text.trim()}
			className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isPlaying ? (
				<>
					<span className="text-green-600">⏸️</span>
					<span className="text-sm text-green-700">재생 중지</span>
				</>
			) : (
				<>
					<span className="text-green-600">🔊</span>
					<span className="text-sm text-green-700">음성 재생</span>
				</>
			)}
		</button>
	);
}
