"use client";

interface PracticeHeaderProps {
	progressPercentage: number;
}

export default function PracticeHeader({ progressPercentage }: PracticeHeaderProps) {
	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-bold">문장별 번역 연습</h3>
				<div className="text-sm text-gray-600">진행률: {progressPercentage}%</div>
			</div>

			<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
				<h4 className="font-semibold mb-2">학습 포인트 안내</h4>
				<div className="flex flex-wrap gap-4 text-sm">
					<div className="flex items-center gap-2">
						<span className="bg-yellow-200 px-2 py-1 rounded">
							기본 학습 포인트
						</span>
						<span>← 클릭하면 영어 표현 확인</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="bg-orange-200 px-2 py-1 rounded">
							내가 선택한 포인트
						</span>
						<span>← 체크포인트로도 저장됨 (로그인 사용자만)</span>
					</div>
				</div>
			</div>
		</>
	);
}