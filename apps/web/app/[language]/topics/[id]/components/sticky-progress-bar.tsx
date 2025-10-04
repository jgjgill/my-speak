"use client";

import { useWebView } from "../../../../contexts/webview-context";

interface StickyProgressBarProps {
	progressPercentage: number;
}

export default function StickyProgressBar({
	progressPercentage,
}: StickyProgressBarProps) {
	const { isWebView, hideHeader } = useWebView();

	const topPosition = isWebView && hideHeader ? "top-0" : "top-16";

	return (
		<div className={`sticky ${topPosition} z-40 bg-white -mx-4 px-4 pb-2`}>
			<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
				<div
					className="h-full bg-primary animate-progress-grow transition-[width] duration-500 ease-out"
					style={
						{
							"--target-width": `${progressPercentage}%`,
							width: `${progressPercentage}%`,
						} as React.CSSProperties
					}
				/>
			</div>
		</div>
	);
}
