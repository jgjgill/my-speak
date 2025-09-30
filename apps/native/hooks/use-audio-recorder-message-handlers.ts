import {
	AudioModule,
	RecordingPresets,
	setAudioModeAsync,
	useAudioPlayer,
	useAudioPlayerStatus,
	useAudioRecorder,
	useAudioRecorderState,
} from "expo-audio";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface WebViewRef {
	current?: {
		postMessage: (message: string) => void;
	} | null;
}

export function useAudioRecorderMessageHandlers(webViewRef: WebViewRef) {
	const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
		null,
	); // null: 미확인, false: 거부, true: 허용
	const [recordedUri, setRecordedUri] = useState<string | null>(null);

	const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY!);
	const recorderState = useAudioRecorderState(audioRecorder);

	const audioPlayer = useAudioPlayer(recordedUri || "");
	const playerStatus = useAudioPlayerStatus(audioPlayer);

	const requestPermissionAndSetup = async () => {
		try {
			console.log("🎤 마이크 권한 요청 시작");
			const status = await AudioModule.requestRecordingPermissionsAsync();
			if (!status.granted) {
				Alert.alert(
					"마이크 권한 필요",
					"녹음 기능을 사용하려면 마이크 권한이 필요합니다.\n설정에서 마이크 권한을 허용해주세요.",
					[
						{ text: "취소", style: "cancel" },
						{
							text: "설정 열기",
							onPress: () => Linking.openSettings(),
						},
					],
				);
				setPermissionGranted(false);
				return false;
			}

			await setAudioModeAsync({
				playsInSilentMode: true,
				allowsRecording: true,
			});

			setPermissionGranted(true);
			return true;
		} catch (error) {
			console.error("오디오 권한 요청 실패:", error);
			setPermissionGranted(false);
			return false;
		}
	};

	const startRecording = async () => {
		if (!permissionGranted) {
			const hasPermission = await requestPermissionAndSetup();

			if (!hasPermission) {
				return;
			}
		}

		try {
			console.log("🎤 네이티브에서 녹음 시작");
			await audioRecorder.prepareToRecordAsync();
			audioRecorder.record();

			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_RECORDING_STARTED",
					payload: { status: "recording" },
				}),
			);
		} catch (error) {
			console.error("녹음 시작 실패:", error);
			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_RECORDING_ERROR",
					payload: {
						error: "RECORDING_FAILED",
						message: (error as Error).message,
					},
				}),
			);
		}
	};

	const stopRecording = async () => {
		try {
			console.log("⏹️ 네이티브에서 녹음 중지");
			await audioRecorder.stop();

			const uri = audioRecorder.uri;
			console.log("✅ 녹음 완료, URI:", uri);

			setRecordedUri(uri);

			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_RECORDING_COMPLETE",
					payload: {
						audioUri: uri,
						duration: (recorderState.durationMillis || 0) / 1000, // 초 단위로 변환
						fileSize: ((recorderState.durationMillis || 0) / 1000) * 8000,
					},
				}),
			);
		} catch (error) {
			console.error("녹음 중지 실패:", error);
			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_RECORDING_ERROR",
					payload: {
						error: "STOP_RECORDING_FAILED",
						message: (error as Error).message,
					},
				}),
			);
		}
	};

	const playRecording = async () => {
		if (!recordedUri) {
			console.warn("재생할 녹음 파일이 없습니다.");
			return;
		}

		try {
			if (playerStatus.didJustFinish) {
				console.log("🔄 재생 완료 후 처음부터 다시 재생");
				audioPlayer.seekTo(0);
			}

			console.log("▶️ 녹음 재생 시작");
			audioPlayer.play();

			// 웹뷰에 재생 시작 알림
			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_PLAYBACK_STARTED",
					payload: {
						audioUri: recordedUri,
						duration: playerStatus.duration || 0,
						currentTime: playerStatus.currentTime || 0,
					},
				}),
			);
		} catch (error) {
			console.error("재생 실패:", error);
			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_PLAYBACK_ERROR",
					payload: {
						error: "PLAYBACK_FAILED",
						message: (error as Error).message,
					},
				}),
			);
		}
	};

	const pauseRecording = async () => {
		try {
			console.log("⏸️ 녹음 재생 일시정지");
			await audioPlayer.pause();

			// 웹뷰에 일시정지 알림
			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_PLAYBACK_PAUSED",
					payload: { audioUri: recordedUri },
				}),
			);
		} catch (error) {
			console.error("일시정지 실패:", error);
		}
	};

	const seekToPosition = async (seekTime: number) => {
		if (!recordedUri) {
			console.warn("재생할 녹음 파일이 없습니다.");
			return;
		}

		try {
			console.log(`⏭️ 재생 위치 이동: ${seekTime}초`);
			await audioPlayer.seekTo(seekTime);

			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_PLAYBACK_SEEKED",
					payload: {
						audioUri: recordedUri,
						currentTime: seekTime,
						duration: playerStatus.duration || 0,
					},
				}),
			);
		} catch (error) {
			console.error("재생 위치 이동 실패:", error);
			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_PLAYBACK_ERROR",
					payload: {
						error: "SEEK_FAILED",
						message: (error as Error).message,
					},
				}),
			);
		}
	};

	useEffect(() => {
		if (!recordedUri || !playerStatus) return;

		if (playerStatus.didJustFinish) {
			webViewRef.current?.postMessage(
				JSON.stringify({
					type: "AUDIO_PLAYBACK_ENDED",
					payload: {
						audioUri: recordedUri,
						duration: playerStatus.duration || 0,
					},
				}),
			);
		}

		webViewRef.current?.postMessage(
			JSON.stringify({
				type: "AUDIO_PLAYBACK_PROGRESS",
				payload: {
					audioUri: recordedUri,
					currentTime: playerStatus.currentTime || 0,
					duration: playerStatus.duration || 0,
					isPlaying: playerStatus.playing || false,
				},
			}),
		);
	}, [playerStatus, recordedUri, webViewRef]);

	return {
		startRecording,
		stopRecording,
		playRecording,
		pauseRecording,
		seekToPosition,
		isRecording: recorderState.isRecording,
		duration: (recorderState.durationMillis || 0) / 1000, // 초 단위로 변환
		permissionGranted,
		hasRecording: !!recordedUri,
	};
}
