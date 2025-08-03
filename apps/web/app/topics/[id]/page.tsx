import { notFound } from "next/navigation";
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
					{koreanScripts.map((script, index) => (
						<div key={script.id} className="mb-4 p-2 border">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div>
									<span className="text-sm">한글 {index + 1}</span>
									<p>{script.korean_text}</p>
								</div>
								<div>
									<span className="text-sm">영어 {index + 1}</span>
									<p>{englishScripts[index]?.english_text}</p>
								</div>
							</div>
						</div>
					))}
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
						<p className="text-sm mb-3">이제 전체를 한 번에 따라 읽어보세요:</p>
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

				{koreanScripts.map((script, index) => (
					<div key={script.id} className="mb-3 p-2 border">
						<div className="mb-2">
							<strong>
								{index + 1}. {script.korean_text}
							</strong>
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
				))}
			</div>

			{/* 4단계: 키워드 스피치 */}
			<div className="border p-4">
				<h2 className="text-xl font-bold mb-4">4단계: 키워드 스피치</h2>
				<p className="mb-4">키워드를 보고 완전한 문장을 만들어보세요.</p>

				{keywordSpeeches.map((speech, index) => (
					<div key={speech.id} className="mb-3 p-2 border">
						<div className="mb-2">
							<strong>{index + 1}. 키워드:</strong>
							{speech.keywords.map((keyword, i) => (
								<span
									key={keyword}
									className="ml-1 px-2 py-1 bg-yellow-200 rounded"
								>
									{keyword}
								</span>
							))}
						</div>
						<details>
							<summary className="cursor-pointer text-blue-600">
								목표 문장 보기
							</summary>
							<p className="mt-2 p-2 bg-gray-100">{speech.target_sentence}</p>
						</details>
					</div>
				))}
			</div>
		</div>
	);
}
