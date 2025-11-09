"use client";

import { useEffect, useState } from "react";
import { openInApp, shouldShowAppButton } from "@/shared/lib/deep-link";

export default function FloatingAppButton() {
	const [isVisible, setIsVisible] = useState(false);
	const [isExpanded, setIsExpanded] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		if (!shouldShowAppButton()) return;

		setIsVisible(true);

		const updateButtonOnScroll = () => {
			const currentScrollY = window.scrollY;
			const direction = currentScrollY > lastScrollY ? "down" : "up";

			setLastScrollY(currentScrollY);

			if (direction === "down" && currentScrollY > 300) {
				setIsExpanded(false);
			} else if (direction === "up" && currentScrollY < 300) {
				setIsExpanded(true);
			}
		};

		window.addEventListener("scroll", updateButtonOnScroll, { passive: true });
		return () => window.removeEventListener("scroll", updateButtonOnScroll);
	}, [lastScrollY]);

	const handleClick = () => {
		openInApp();
	};

	if (!isVisible) return null;

	return (
		<button
			type="button"
			onClick={handleClick}
			className={`
				fixed bottom-6 left-6 z-50
				bg-primary hover:bg-primary/90 text-white
				shadow-lg hover:shadow-xl
				transition-all duration-300 ease-in-out
				transform hover:scale-105 active:scale-95
				flex items-center
				h-12 rounded-full overflow-hidden
				${isExpanded ? "justify-start pl-4 pr-5" : "justify-center w-12"}
			`}
			style={{
				width: isExpanded ? "auto" : "48px",
				minWidth: isExpanded ? "140px" : "48px",
			}}
			aria-label="앱에서 보기"
		>
			{/* 아이콘 */}
			<div
				className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${isExpanded ? "" : "w-full"}`}
			>
				<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
					<title>모바일 앱</title>
					<path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H7V6h10v10z" />
				</svg>
			</div>

			{/* 텍스트 - 확장 상태에서만 표시 */}
			{isExpanded && (
				<div className="flex items-center gap-2 ml-3">
					<span className="font-medium text-sm whitespace-nowrap">
						앱에서 보기
					</span>
					<svg
						className="w-4 h-4 flex-shrink-0 opacity-80"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>외부 링크</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</div>
			)}
		</button>
	);
}
