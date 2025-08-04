import type { Tables } from "@repo/typescript-config/supabase-types";
import Highlighter from "react-highlight-words";

type KoreanScript = Tables<"korean_scripts">;
type EnglishScript = Tables<"english_scripts">;

interface StageThreeSectionProps {
	koreanScripts: KoreanScript[];
	englishScripts: EnglishScript[];
	getSelectedKoreanKeywords: (sentenceOrder: number) => string[];
}

export default function StageThreeSection({
	koreanScripts,
	englishScripts,
	getSelectedKoreanKeywords,
}: StageThreeSectionProps) {
	return (
		<div className="border p-4 mb-6">
			<h2 className="text-xl font-bold mb-4">3단계: 스피킹 연습</h2>
			<p className="mb-4">한글을 보고 영어로 말해보세요.</p>

			<div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
				<h4 className="font-semibold mb-2">1단계에서 체크한 학습 포인트</h4>
				<div className="flex items-center gap-2 text-sm">
					<span className="bg-orange-200 px-2 py-1 rounded">강조 표현</span>
					<span>← 로그인 사용자만 표시됩니다</span>
				</div>
			</div>

			{koreanScripts.map((script, index) => {
				const selectedKoreanKeywords = getSelectedKoreanKeywords(
					script.sentence_order,
				);

				return (
					<div key={script.id} className="mb-3 p-2 border">
						<div className="mb-2">
							<strong className="mr-2">{index + 1}.</strong>
							<span className="text-lg leading-relaxed">
								<Highlighter
									searchWords={selectedKoreanKeywords}
									textToHighlight={script.korean_text}
									highlightClassName="bg-orange-200 px-1 rounded"
								/>
							</span>
						</div>
						<details>
							<summary className="cursor-pointer text-blue-600">
								답안 보기
							</summary>
							<p className="mt-2 p-2 bg-gray-100">
								{englishScripts[index]?.chunked_text}
							</p>
						</details>
					</div>
				);
			})}
		</div>
	);
}
