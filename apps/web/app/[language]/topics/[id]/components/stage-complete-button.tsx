"use client";

import { useAuth } from "../../../../contexts/auth-context";

interface StageCompleteButtonProps {
	isStageComplete: boolean;
	onStageComplete: () => void;
}

export default function StageCompleteButton({
	isStageComplete,
	onStageComplete,
}: StageCompleteButtonProps) {
	const { user } = useAuth();

	if (!isStageComplete) {
		return null;
	}

	const handleNextStage = async () => {
		if (user && isStageComplete) {
			try {
				await onStageComplete();
				alert("🎉 2단계로 이동합니다. 🎉");
			} catch (error) {
				console.error("단계 완료 처리 중 오류:", error);
				alert("단계 진행 중 오류가 발생했습니다. 다시 시도해주세요.");
			}
		}
	};

	return (
		<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
			<div className="flex items-center justify-between">
				<div>
					<h4 className="font-bold text-green-800 mb-1">🎉 1단계 완료!</h4>
					<p className="text-sm text-green-700">
						모든 번역을 완료했습니다. 2단계로 진행해보세요.
					</p>
				</div>
				{user ? (
					<button
						type="button"
						onClick={handleNextStage}
						className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
					>
						2단계로 이동하기
					</button>
				) : (
					<div className="text-sm text-gray-500">
						로그인하면 다음 단계로 진행할 수 있습니다.
					</div>
				)}
			</div>
		</div>
	);
}
