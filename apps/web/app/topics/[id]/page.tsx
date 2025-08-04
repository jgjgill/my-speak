import { notFound } from "next/navigation";
import Highlighter from "react-highlight-words";
import { createClient } from "../../utils/supabase/server";
import StageOnePractice from "./stage-one-practice";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
	const { id } = await params;
	const supabase = await createClient();

	// 토픽 데이터 가져오기
	const { data: topic, error: topicError } = await supabase
		.from("topics")
		.select("*")
		.eq("id", id)
		.single();

	if (topicError || !topic) {
		notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const [
		koreanResult,
		englishResult,
		keywordResult,
		learningPointsResult,
		userTranslationsResult,
		userSelectedPointsResult,
	] = await Promise.all([
		supabase
			.from("korean_scripts")
			.select("*")
			.eq("topic_id", id)
			.order("sentence_order"),

		supabase
			.from("english_scripts")
			.select("*")
			.eq("topic_id", id)
			.order("sentence_order"),

		supabase
			.from("keyword_speeches")
			.select("*")
			.eq("topic_id", id)
			.order("sequence_order"),

		supabase
			.from("learning_points")
			.select("*")
			.eq("topic_id", id)
			.order("sentence_order"),

		user
			? supabase
					.from("user_translations")
					.select("*")
					.eq("user_id", user.id)
					.eq("topic_id", id)
			: Promise.resolve({ data: null, error: null }),

		user
			? supabase
					.from("user_selected_points")
					.select("learning_point_id")
					.eq("user_id", user.id)
					.eq("topic_id", id)
			: Promise.resolve({ data: null, error: null }),
	]);

	const koreanScripts = koreanResult.data || [];
	const englishScripts = englishResult.data || [];
	const keywordSpeeches = keywordResult.data || [];
	const learningPoints = learningPointsResult.data || [];
	const userTranslations = userTranslationsResult.data || [];
	const userSelectedPoints = userSelectedPointsResult.data || [];

	const learningPointsByOrder = learningPoints.reduce(
		(acc, point) => {
			if (!acc[point.sentence_order]) {
				acc[point.sentence_order] = [];
			}

			acc[point.sentence_order]?.push(point);
			return acc;
		},
		{} as Record<number, typeof learningPoints>,
	);

	const initialUserProgress = userTranslations.reduce(
		(acc, translation) => {
			acc[translation.sentence_order] = {
				translation: translation.user_translation,
				isCompleted: translation.is_completed || false,
				timestamp: translation.updated_at
					? new Date(translation.updated_at)
					: undefined,
			};
			return acc;
		},
		{} as Record<
			number,
			{ translation?: string; isCompleted?: boolean; timestamp?: Date }
		>,
	);

	const initialSelectedPoints = new Set(
		userSelectedPoints
			.map((point) => {
				// learning_point_id로 해당 학습 포인트의 sentence_order 찾기
				const learningPoint = learningPoints.find(
					(lp) => lp.id === point.learning_point_id,
				);
				return learningPoint
					? `${learningPoint.sentence_order}-${point.learning_point_id}`
					: "";
			})
			.filter(Boolean),
	);

	// 선택된 학습 포인트 데이터를 문장별로 그룹화
	const selectedLearningPointsByOrder = userSelectedPoints.reduce(
		(acc, point) => {
			const learningPoint = learningPoints.find(
				(lp) => lp.id === point.learning_point_id,
			);
			if (learningPoint) {
				if (!acc[learningPoint.sentence_order]) {
					acc[learningPoint.sentence_order] = [];
				}
				acc[learningPoint.sentence_order]?.push(learningPoint);
			}
			return acc;
		},
		{} as Record<number, typeof learningPoints>,
	);

	// 문장별 선택된 한글 키워드 추출
	const getSelectedKoreanKeywords = (sentenceOrder: number) => {
		const points = selectedLearningPointsByOrder[sentenceOrder] || [];
		return points.map((point) => point.korean_phrase);
	};

	// 문장별 선택된 영어 키워드 추출
	const getSelectedEnglishKeywords = (sentenceOrder: number) => {
		const points = selectedLearningPointsByOrder[sentenceOrder] || [];
		return points.map((point) => point.english_phrase);
	};

	// 키워드 스피치를 레벨별로 그룹화
	const keywordSpeechesByLevel = keywordSpeeches.reduce(
		(acc, speech) => {
			const level = speech.level || 1;
			if (!acc[level]) {
				acc[level] = [];
			}
			acc[level]?.push(speech);
			return acc;
		},
		{} as Record<number, typeof keywordSpeeches>,
	);

	// 레벨별 메타데이터
	const levelMetadata = {
		1: {
			title: "Level 1: 70% 정보 제공",
			color: "border-green-300 bg-green-50",
			description: "상세한 키워드로 문장 구성 연습",
		},
		2: {
			title: "Level 2: 50% 정보 제공",
			color: "border-green-400 bg-green-100",
			description: "핵심 키워드로 문장 만들기",
		},
		3: {
			title: "Level 3: 30% 정보 제공",
			color: "border-green-500 bg-green-200",
			description: "최소 키워드로 완전한 문장 구성",
		},
		4: {
			title: "Level 4: 영어 키워드",
			color: "border-green-600 bg-green-300",
			description: "영어 키워드만으로 자유로운 표현",
		},
	};

	return (
		<div className="p-4">
			{/* 헤더 */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
				<div className="mb-2">
					<span className="mr-2">{topic.category}</span>
					<span className="mr-2">{topic.difficulty}</span>
					<span>총 {topic.total_sentences}문장</span>
				</div>
				{topic.description && <p className="mb-4">{topic.description}</p>}
			</div>

			{/* 1단계: 한글 스크립트 */}
			<div className="border p-4 mb-6">
				<h2 className="text-xl font-bold mb-4">1단계: 한글 스크립트</h2>

				{/* 전체 한글 스크립트 */}
				<div className="mb-6">
					<h3 className="font-bold mb-3">전체 한글 스크립트</h3>
					<div>
						{koreanScripts.map((script, index) => (
							<span key={script.id}>
								{script.korean_text}
								{index < koreanScripts.length - 1 && " "}
							</span>
						))}
					</div>
				</div>

				{/* 미션 안내 */}
				<div className="mb-4 p-3 border">
					<strong>미션:</strong> 아래 한글 문장들을 영어로 번역해보세요.
					완벽하지 않아도 괜찮습니다!
				</div>

				{/* 문장별 번역 연습 - 클라이언트 컴포넌트 */}
				<StageOnePractice
					koreanScripts={koreanScripts}
					learningPointsByOrder={learningPointsByOrder}
					topicId={id}
					initialUserProgress={initialUserProgress}
					initialSelectedPoints={initialSelectedPoints}
				/>
			</div>

			{/* 2단계: 영어 스크립트 */}
			<div className="border p-4 mb-6">
				<h2 className="text-xl font-bold mb-4">2단계: 영어 스크립트</h2>

				{/* 한글-영어 나란히 비교 */}
				<div className="mb-6">
					<h3 className="font-bold mb-3">한글 ↔ 영어 비교</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h4 className="font-semibold mb-2">한글</h4>
							<div>
								{koreanScripts.map((script, index) => (
									<span key={script.id}>
										{script.korean_text}
										{index < koreanScripts.length - 1 && " "}
									</span>
								))}
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-2">영어</h4>
							<div>
								{englishScripts.map((script, index) => (
									<span key={script.id}>
										{script.english_text}
										{index < englishScripts.length - 1 && " "}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* 문장별 한영 비교 */}
				<div className="mb-6">
					<h3 className="font-bold mb-3">문장별 한영 비교</h3>

					<div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
						<h4 className="font-semibold mb-2">1단계에서 체크한 학습 포인트</h4>
						<div className="flex items-center gap-2 text-sm">
							<span className="bg-orange-200 px-2 py-1 rounded">강조 표현</span>
							<span>← 로그인 사용자만 표시됩니다</span>
						</div>
					</div>

					{koreanScripts.map((script, index) => {
						const userTranslation = userTranslations.find(
							(t) => t.sentence_order === script.sentence_order,
						);
						const selectedKoreanKeywords = getSelectedKoreanKeywords(
							script.sentence_order,
						);
						const selectedEnglishKeywords = getSelectedEnglishKeywords(
							script.sentence_order,
						);

						return (
							<div key={script.id} className="mb-4 p-2 border">
								<span className="font-semibold">문장 {index + 1}</span>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<div>
										<span className="text-sm font-medium">한글</span>
										<div className="leading-relaxed">
											<Highlighter
												searchWords={selectedKoreanKeywords}
												textToHighlight={script.korean_text}
												highlightClassName="bg-orange-200 px-1 rounded"
											/>
										</div>
									</div>

									<div>
										<span className="text-sm font-medium">번역</span>
										<div className="leading-relaxed">
											<Highlighter
												searchWords={selectedEnglishKeywords}
												textToHighlight={
													englishScripts[index]?.english_text || ""
												}
												highlightClassName="bg-orange-200 px-1 rounded"
											/>
										</div>
									</div>

									<details>
										<summary className="cursor-pointer text-sm font-light">
											내 번역
										</summary>
										{userTranslation && (
											<p className="bg-blue-50 text-sm p-2 font-light rounded">
												{userTranslation.user_translation}
											</p>
										)}
										{!userTranslation && (
											<p className="text-gray-500 text-sm italic font-light">
												로그인시 번역한 내용도 같이 볼 수 있어요.
											</p>
										)}
									</details>
								</div>
							</div>
						);
					})}
				</div>

				{/* 끊어읽기 */}
				<div className="mb-6">
					<h3 className="font-bold mb-3">끊어읽기 발음 연습</h3>
					<p className="text-sm mb-4">
						| 표시된 곳에서 잠깐 멈춤, || 표시된 곳에서 긴 호흡을 하며
						읽어보세요.
					</p>

					{/* 문장별 끊어읽기 */}
					{englishScripts.map((script, index) => (
						<div key={script.id} className="mb-3 p-2 border">
							<span className="text-sm">발음 연습 {index + 1}</span>
							<p>{script.chunked_text}</p>
						</div>
					))}

					{/* 전체 끊어읽기 스크립트 */}
					<div className="mt-6 p-3 border">
						<h4 className="font-bold mb-3">전체 끊어읽기 스크립트</h4>
						<p className="text-sm mb-3">이제 전체를 한 번에 따라 읽어보세요.</p>
						<div>
							{englishScripts.map((script, index) => (
								<span key={script.id}>
									{script.chunked_text}
									{index < englishScripts.length - 1 && " || "}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* 3단계: 스피킹 연습 */}
			<div className="border p-4 mb-6">
				<h2 className="text-xl font-bold mb-4">3단계: 스피킹 연습</h2>
				<p className="mb-4">한글을 보고 영어로 말해보세요.</p>

				{/* 안내 문구 */}
				{user && userSelectedPoints.length > 0 && (
					<div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
						<h4 className="font-semibold mb-2">1단계에서 체크한 학습 포인트</h4>
						<div className="flex items-center gap-2 text-sm">
							<span className="bg-orange-200 px-2 py-1 rounded">강조 표현</span>
							<span>← 로그인 사용자만 표시됩니다</span>
						</div>
					</div>
				)}

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

			{/* 4단계: 키워드 스피치 */}
			<div className="border p-4">
				<h2 className="text-xl font-bold mb-4">4단계: 키워드 스피치</h2>
				<p className="mb-4">키워드를 보고 완전한 문장을 만들어보세요.</p>

				{/* 레벨별 안내 */}
				<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
					<h3 className="font-semibold mb-2">🎯 학습 진행 방식</h3>
					<div className="text-sm space-y-1">
						<p>
							• <strong>Level 1</strong>부터 순차적으로 진행하세요.
						</p>
						<p>• 레벨이 올라갈수록 키워드가 줄어들어요.</p>
					</div>
				</div>

				{/* 레벨별 키워드 스피치 */}
				<div className="space-y-4">
					{[1, 2, 3, 4].map((level) => {
						const levelSpeeches = keywordSpeechesByLevel[level] || [];
						const metadata = levelMetadata[level as keyof typeof levelMetadata];

						if (levelSpeeches.length === 0) return null;

						return (
							<div
								key={level}
								className={`border rounded-lg ${metadata.color}`}
							>
								<details className="group" open={level === 1}>
									<summary className="cursor-pointer p-4 hover:bg-opacity-75 transition-colors">
										<div className="flex items-center justify-between">
											<div>
												<h3 className="text-lg font-bold">{metadata.title}</h3>
												<p className="text-sm text-gray-600 mt-1">
													{metadata.description}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm bg-white px-2 py-1 rounded border">
													{levelSpeeches.length}개 문항
												</span>
												<span className="group-open:rotate-180 transition-transform duration-200">
													▼
												</span>
											</div>
										</div>
									</summary>

									<div className="px-4 pb-4 space-y-3">
										{levelSpeeches.map((speech, index) => (
											<div
												key={speech.id}
												className="bg-white p-3 border rounded"
											>
												<div className="mb-3">
													<div className="flex items-center gap-2 mb-2">
														<span className="font-semibold text-sm bg-gray-100 px-2 py-1 rounded">
															{index + 1}번
														</span>
														<span className="text-sm text-gray-500">
															난이도:{" "}
															{speech.difficulty_percentage
																? `${speech.difficulty_percentage}%`
																: "영어키워드"}
														</span>
													</div>
													<div className="flex flex-wrap gap-1">
														<span className="text-sm font-medium mr-2">
															키워드:
														</span>
														{speech.keywords.map((keyword) => (
															<span
																key={keyword}
																className="px-2 py-1 bg-yellow-200 text-sm rounded"
															>
																{keyword}
															</span>
														))}
													</div>
												</div>
												<details>
													<summary className="cursor-pointer text-blue-600 text-sm hover:text-blue-800">
														💡 목표 문장 보기
													</summary>
													<div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-400">
														<p className="text-sm font-medium">
															{speech.target_sentence}
														</p>
													</div>
												</details>
											</div>
										))}

										{/* 레벨 완료 체크 */}
										<div className="mt-4 p-3 bg-white border-2 border-dashed border-gray-300 rounded text-center">
											<p className="text-sm text-gray-600">
												✅ {metadata.title} 완료 후 다음 레벨로 진행하세요
											</p>
										</div>
									</div>
								</details>
							</div>
						);
					})}
				</div>

				{/* 최종 완료 안내 */}
				<div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded">
					<h3 className="font-bold text-green-800 mb-2">
						🏆 모든 레벨 완료 목표
					</h3>
					<p className="text-sm text-green-700">Cool!</p>
				</div>
			</div>
		</div>
	);
}
