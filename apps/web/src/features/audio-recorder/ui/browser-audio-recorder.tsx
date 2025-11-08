"use client";

import { useEffect, useRef, useState } from "react";

interface BrowserAudioRecorderProps {
	onRecordingComplete: (hasRecorded: boolean) => void;
}

export default function BrowserAudioRecorder({
	onRecordingComplete,
}: BrowserAudioRecorderProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [hasRecorded, setHasRecorded] = useState(false);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null,
	);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const audioRef = useRef<HTMLAudioElement>(null);

	// 오디오 이벤트 리스너 설정
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !audioUrl) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => {
			const dur = audio.duration;
			setDuration(dur);
		};
		const handleEnded = () => setIsPlaying(false);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("canplay", updateDuration);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("durationchange", updateDuration);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("canplay", updateDuration);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("durationchange", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [audioUrl]);

	const formatTime = (time: number) => {
		if (Number.isNaN(time) || !Number.isFinite(time) || time <= 0)
			return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const startRecording = async () => {
		try {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
				setAudioUrl(null);
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// 브라우저별 최적 포맷 선택
			const getSupportedMimeType = () => {
				const types = [
					"audio/mp4", // Safari 호환
					"audio/webm;codecs=opus", // Chrome 최적
					"audio/webm", // Chrome 기본
				];
				return (
					types.find((type) => MediaRecorder.isTypeSupported(type)) ||
					"audio/webm"
				);
			};

			const mimeType = getSupportedMimeType();

			const recorder = new MediaRecorder(stream, { mimeType });
			const chunks: Blob[] = [];

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunks.push(event.data);
				}
			};

			recorder.onstop = () => {
				const audioBlob = new Blob(chunks, { type: mimeType });
				const url = URL.createObjectURL(audioBlob);
				setAudioUrl(url);
				setIsRecording(false);
				setHasRecorded(true);
				onRecordingComplete(true);
				stream.getTracks().forEach((track) => track.stop());
			};

			setMediaRecorder(recorder);
			recorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("녹음 시작 실패:", error);
			alert("마이크 접근 권한이 필요합니다.");
		}
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
		}
	};

	const resetRecording = () => {
		setHasRecorded(false);
		setIsPlaying(false);
		setCurrentTime(0);
		setDuration(0);
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
			setAudioUrl(null);
		}
		onRecordingComplete(false);
	};

	const togglePlayPause = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
		} else {
			audio.play();
			setIsPlaying(true);
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const audio = audioRef.current;
		if (!audio) return;

		const newTime = Number(e.target.value);
		audio.currentTime = newTime;
		setCurrentTime(newTime);
	};

	return (
		<div className="p-4 bg-blue-50 border border-blue-200 rounded">
			<h4 className="font-semibold mb-3">🎤 음성 녹음하기</h4>
			<p className="text-sm mb-4">위 스크립트를 소리내어 읽어보세요.</p>

			<div className="flex gap-3">
				{!isRecording && !hasRecorded && (
					<button
						type="button"
						onClick={startRecording}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
					>
						🔴 녹음 시작
					</button>
				)}

				{isRecording && (
					<button
						type="button"
						onClick={stopRecording}
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
					>
						⏹️ 녹음 중지
					</button>
				)}

				{hasRecorded && audioUrl && (
					<div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
						<div className="flex items-center gap-3 mb-3">
							<span className="text-green-600">✅ 녹음 완료!</span>
							<button
								type="button"
								onClick={resetRecording}
								className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
							>
								<div className="relative w-3 h-3">
									<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
									<div
										className="absolute top-0 right-0 w-1 h-1 bg-white transform rotate-45"
										style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
									/>
								</div>
								<span>다시 녹음</span>
							</button>
						</div>

						<audio ref={audioRef} src={audioUrl}>
							<track kind="captions" label="Korean captions" />
						</audio>

						<div className="bg-white p-3 rounded border">
							<div className="flex items-center gap-3 mb-2">
								<button
									type="button"
									onClick={togglePlayPause}
									className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
								>
									{isPlaying ? (
										<div className="flex gap-1">
											<div className="w-1 h-4 bg-white rounded-sm" />
											<div className="w-1 h-4 bg-white rounded-sm" />
										</div>
									) : (
										<div className="w-0 h-0 border-l-12 border-l-white border-y-8 border-y-transparent ml-0.5" />
									)}
								</button>

								<div className="flex-1">
									<input
										type="range"
										min={0}
										max={duration || 0}
										value={currentTime}
										step="any"
										onChange={handleSeek}
										className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
									/>
								</div>

								<div className="text-sm text-gray-600 min-w-[80px]">
									{formatTime(currentTime)} / {formatTime(duration)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
