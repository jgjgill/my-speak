"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
	isAndroidClient,
	isDesktopClient,
	isIOSClient,
	isMobileWebClient,
} from "../utils/platform-client";

type DeviceType = "ios" | "android" | "desktop" | "unknown";

export default function AppDownloadModal() {
	const [isVisible, setIsVisible] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [deviceType, setDeviceType] = useState<DeviceType>("unknown");

	useEffect(() => {
		// 모바일 웹에서만 모달 표시
		if (!isMobileWebClient()) return;

		// sessionStorage에서 "다시 보지 않기" 설정 확인
		const dontShowAgain = sessionStorage.getItem("hideAppDownloadModal");
		if (dontShowAgain === "true") return;

		// 디바이스 타입 설정
		if (isIOSClient()) {
			setDeviceType("ios");
		} else if (isAndroidClient()) {
			setDeviceType("android");
		} else if (isDesktopClient()) {
			setDeviceType("desktop");
		}

		// 모달 표시
		setIsVisible(true);
	}, []);

	const handleOpenInApp = () => {
		const deepLinkUrl = "https://myspeak-native.expo.app";
		window.location.href = deepLinkUrl;
	};

	const handleClose = () => {
		setIsClosing(true);
		sessionStorage.setItem("hideAppDownloadModal", "true");

		// 애니메이션 완료 후 모달 숨기기
		setTimeout(() => {
			setIsVisible(false);
			setIsClosing(false);
		}, 300); // 애니메이션 시간과 동일
	};

	const handleBackgroundClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	if (!isVisible) return null;

	return (
		<div
			role="dialog"
			className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
			onClick={handleBackgroundClick}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					handleClose();
				}
			}}
		>
			<div
				className={`w-full max-w-md bg-white rounded-t-2xl p-6 mx-4 mb-0 ${
					isClosing ? "animate-slide-down" : "animate-slide-up"
				}`}
			>
				{/* 헤더 */}
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-korean">
						더 나은 앱 경험을 위해
					</h3>
					<button
						type="button"
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 text-2xl"
						aria-label="모달 닫기"
					>
						×
					</button>
				</div>

				{/* 콘텐츠 */}
				<div className="space-y-4">
					{/* 앱 아이콘과 설명 */}
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
							<Image
								src="/app-icon.png"
								alt="My Speak 앱 아이콘"
								width={64}
								height={64}
								className="w-full h-full object-cover"
							/>
						</div>
						<div>
							<h4 className="font-semibold text-korean">My Speak</h4>
							<p className="text-sm text-gray-600">
								더 빠르고 편리한 학습 경험
							</p>
						</div>
					</div>

					{/* 버튼들 */}
					<div className="space-y-3">
						<button
							type="button"
							onClick={handleOpenInApp}
							className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
						>
							앱으로 보기
						</button>

						{/* 스토어 링크 */}
						<div className="flex space-x-2">
							{deviceType === "ios" && (
								<a
									href="https://apps.apple.com/kr/app/myspeak/id6752112155"
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-center text-sm hover:bg-gray-200 transition-colors"
								>
									App Store
								</a>
							)}
							{deviceType === "android" && (
								<button
									type="button"
									onClick={() => alert("Google Play Store 링크 준비 중입니다.")}
									className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-center text-sm hover:bg-gray-200 transition-colors"
								>
									Play Store
								</button>
							)}
						</div>
					</div>

					{/* 하단 옵션 */}
					<div className="flex justify-between items-center pt-2 text-sm">
						<button
							type="button"
							onClick={handleClose}
							className="text-primary hover:text-primary/80"
						>
							웹에서 계속하기
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
