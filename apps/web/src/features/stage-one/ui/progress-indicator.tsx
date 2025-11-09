"use client";

interface ProgressIndicatorProps {
	progressPercentage: number;
}

export default function ProgressIndicator({
	progressPercentage,
}: ProgressIndicatorProps) {
	return (
		<div className="text-sm text-gray-600">진행률: {progressPercentage}%</div>
	);
}
