"use client";

import { useToast } from "@/shared/lib/toast";
import { useWebView } from "@/shared/lib/webview";

const MAX_VISIBLE_TOASTS = 3;

export default function ToastContainer() {
	const { toasts, removeToast } = useToast();
	const { isWebView } = useWebView();

	if (toasts.length === 0) {
		return null;
	}

	const getToastIcon = (type: "success" | "error" | "info") => {
		switch (type) {
			case "success":
				return "✅";
			case "error":
				return "❌";
			case "info":
				return "💡";
			default:
				return "ℹ️";
		}
	};

	const getToastStyles = (type: "success" | "error" | "info") => {
		switch (type) {
			case "success":
				return "bg-green-50 border-green-200 text-green-800";
			case "error":
				return "bg-red-50 border-red-200 text-red-800";
			case "info":
				return "bg-blue-50 border-blue-200 text-blue-800";
			default:
				return "bg-gray-50 border-gray-200 text-gray-800";
		}
	};

	// 최신 토스트들만 표시 (역순으로 정렬하여 최신이 위에)
	const visibleToasts = toasts.slice(-MAX_VISIBLE_TOASTS).reverse();

	return (
		<div
			className={`fixed ${isWebView ? "top-4" : "top-20"} left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[min(90vw,28rem)]`}
		>
			<div className="relative">
				{visibleToasts.map((toast, index) => {
					const isTop = index === 0;
					const isSecond = index === 1;
					const isThird = index === 2;

					let transformStyle = {};
					let opacityClass = "opacity-100";
					let scaleClass = "scale-100";
					let zIndexStyle = {};

					if (isSecond) {
						transformStyle = { transform: "translateY(16px)" };
						opacityClass = "opacity-80";
						scaleClass = "scale-95";
						zIndexStyle = { zIndex: 49 };
					} else if (isThird) {
						transformStyle = { transform: "translateY(32px)" };
						opacityClass = "opacity-60";
						scaleClass = "scale-90";
						zIndexStyle = { zIndex: 48 };
					} else {
						zIndexStyle = { zIndex: 50 };
					}

					return (
						<div
							key={toast.id}
							className={`toast ${getToastStyles(toast.type)} px-4 py-3 rounded-lg border shadow-lg absolute inset-x-0 ${opacityClass} ${scaleClass} transition-all duration-200 ${toast.isExiting ? "toast-exit" : ""}`}
							style={{ ...transformStyle, ...zIndexStyle }}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-start gap-2 min-w-0 flex-1">
									<span className="text-lg leading-none flex-shrink-0">
										{getToastIcon(toast.type)}
									</span>
									<span className="text-sm leading-relaxed break-words">
										{toast.message}
									</span>
								</div>
								{isTop && (
									<button
										type="button"
										onClick={() => removeToast(toast.id)}
										className="flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
										aria-label="Close notification"
									>
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<title>Close</title>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
