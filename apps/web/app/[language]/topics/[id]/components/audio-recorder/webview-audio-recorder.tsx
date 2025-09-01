"use client";

import { useEffect, useState } from "react";

interface WebViewAudioRecorderProps {
	onRecordingComplete: (hasRecorded: boolean) => void;
}

export default function WebViewAudioRecorder({
	onRecordingComplete,
}: WebViewAudioRecorderProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [hasRecorded, setHasRecorded] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [webViewDuration, setWebViewDuration] = useState(0);
	const [webViewCurrentTime, setWebViewCurrentTime] = useState(0);

	const formatTime = (time: number) => {
		if (Number.isNaN(time) || !Number.isFinite(time) || time <= 0)
			return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const startWebViewRecording = () => {
		window.ReactNativeWebView?.postMessage(
			JSON.stringify({
				type: "AUDIO_RECORDING_START",
				payload: { maxDuration: 300 },
			}),
		);
	};

	const stopWebViewRecording = () => {
		window.ReactNativeWebView?.postMessage(
			JSON.stringify({
				type: "AUDIO_RECORDING_STOP",
			}),
		);
	};

	const playWebViewRecording = () => {
		window.ReactNativeWebView?.postMessage(
			JSON.stringify({
				type: "AUDIO_PLAYBACK_START",
			}),
		);
	};

	const pauseWebViewRecording = () => {
		window.ReactNativeWebView?.postMessage(
			JSON.stringify({
				type: "AUDIO_PLAYBACK_PAUSE",
			}),
		);
	};

	const seekWebViewRecording = (newTime: number) => {
		window.ReactNativeWebView?.postMessage(
			JSON.stringify({
				type: "AUDIO_PLAYBACK_SEEK",
				payload: { seekTime: newTime },
			}),
		);
	};

	useEffect(() => {
		const handleMessage = (event: Event) => {
			try {
				const messageEvent = event as MessageEvent;
				const message = JSON.parse(messageEvent.data);

				switch (message.type) {
					case "AUDIO_RECORDING_STARTED":
						setIsRecording(true);
						break;

					case "AUDIO_RECORDING_COMPLETE":
						setIsRecording(false);
						setHasRecorded(true);

						if (message.payload) {
							setWebViewDuration(message.payload.duration || 0);
							setWebViewCurrentTime(0);
						}

						onRecordingComplete(true);
						break;

					case "AUDIO_RECORDING_ERROR":
						setIsRecording(false);
						console.error("❌ 녹음 에러:", message.payload);
						alert(`녹음 실패: ${message.payload.error}`);
						break;

					case "AUDIO_PLAYBACK_STARTED":
						setIsPlaying(true);
						break;

					case "AUDIO_PLAYBACK_PAUSED":
						setIsPlaying(false);
						break;

					case "AUDIO_PLAYBACK_ERROR":
						setIsPlaying(false);
						console.error("❌ 재생 에러:", message.payload);
						alert(`재생 실패: ${message.payload.error}`);
						break;

					case "AUDIO_PLAYBACK_PROGRESS":
						if (message.payload) {
							setWebViewCurrentTime(message.payload.currentTime || 0);
							setWebViewDuration(message.payload.duration || 0);
							setIsPlaying(message.payload.isPlaying || false);
						}
						break;

					case "AUDIO_PLAYBACK_ENDED":
						setIsPlaying(false);
						if (message.payload) {
							setWebViewDuration(message.payload.duration || 0);
							setWebViewCurrentTime(message.payload.duration || 0);
						}
						break;

					case "AUDIO_PLAYBACK_SEEKED":
						if (message.payload) {
							setWebViewCurrentTime(message.payload.currentTime || 0);
							setWebViewDuration(message.payload.duration || 0);
						}
						break;
				}
			} catch (error) {
				console.error("메시지 파싱 실패:", error);
			}
		};

		document.addEventListener("message", handleMessage);
		window.addEventListener("message", handleMessage);

		return () => {
			document.removeEventListener("message", handleMessage);
			window.removeEventListener("message", handleMessage);
		};
	}, [onRecordingComplete]);

	return (
		<div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-sm">
			<div className="text-center mb-6">
				<h4 className="text-lg font-bold text-gray-800 mb-2">
					🎤 음성 녹음하기
				</h4>
				<p className="text-sm text-gray-600">
					위 스크립트를 소리내어 읽어보세요
				</p>
			</div>

			<div className="flex flex-col gap-4">
				{!isRecording && !hasRecorded && (
					<div className="text-center">
						<button
							type="button"
							onClick={startWebViewRecording}
							className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200 active:scale-95"
						>
							🔴 녹음 시작
						</button>
					</div>
				)}

				{isRecording && (
					<div className="text-center">
						<button
							type="button"
							onClick={stopWebViewRecording}
							className="w-full py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200 active:scale-95"
						>
							⏹️ 녹음 중지
						</button>
						<div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
							<p className="text-red-700 py-2 text-sm animate-pulse">
								🔴 녹음 중...
							</p>
						</div>
					</div>
				)}

				{hasRecorded && (
					<div className="space-y-4">
						<div className="space-y-3">
							<div className="text-center">
								<button
									type="button"
									onClick={() => {
										setHasRecorded(false);
										setIsPlaying(false);
										setWebViewDuration(0);
										setWebViewCurrentTime(0);
										onRecordingComplete(false);
									}}
									className="flex items-center justify-center gap-3 px-8 py-4 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors active:scale-95 mx-auto"
								>
									<div className="relative w-3 h-3 flex-shrink-0">
										<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
										<div
											className="absolute top-0 right-0 w-1 h-1 bg-white transform rotate-45"
											style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
										/>
									</div>
									<span className="whitespace-nowrap">다시 녹음</span>
								</button>
							</div>
						</div>

						<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
							<div className="flex items-center gap-4">
								<button
									type="button"
									onClick={
										isPlaying ? pauseWebViewRecording : playWebViewRecording
									}
									className="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full transition-colors active:scale-95"
									style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
								>
									{isPlaying ? (
										<div className="flex gap-1">
											<div className="w-1 h-2 bg-white"></div>
											<div className="w-1 h-2 bg-white"></div>
										</div>
									) : (
										<div
											style={{
												borderLeft: "8px solid white",
												borderTop: "6px solid transparent",
												borderBottom: "6px solid transparent",
												marginLeft: "2px",
											}}
										/>
									)}
								</button>

								<div className="flex-1 space-y-2">
									<input
										type="range"
										min={0}
										max={webViewDuration || 0}
										value={webViewCurrentTime}
										step="any"
										onChange={(e) => {
											const newTime = Number(e.target.value);
											setWebViewCurrentTime(newTime);
											seekWebViewRecording(newTime);
										}}
										className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
										style={{
											background: `linear-gradient(to right, #16a34a 0%, #16a34a ${webViewDuration > 0 ? (webViewCurrentTime / webViewDuration) * 100 : 0}%, #e5e7eb ${webViewDuration > 0 ? (webViewCurrentTime / webViewDuration) * 100 : 0}%, #e5e7eb 100%)`,
										}}
									/>
									<div className="text-sm text-gray-500 text-center font-medium">
										{formatTime(webViewCurrentTime)} /{" "}
										{formatTime(webViewDuration)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
