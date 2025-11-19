import { createBrowserClient } from "@/shared/api/supabase";

/**
 * user_progress의 completed_sentences를 업데이트합니다.
 * 이미 완료된 문장이면 추가하지 않고, 새로운 문장이면 배열에 추가합니다.
 */
export async function updateCompletedSentences(
	userId: string,
	topicId: string,
	sentenceOrder: number,
	isCompleted: boolean,
): Promise<void> {
	const supabase = createBrowserClient();

	// 1. 현재 user_progress 가져오기
	const { data: progress, error: fetchError } = await supabase
		.from("user_progress")
		.select("id, completed_sentences")
		.eq("user_id", userId)
		.eq("topic_id", topicId)
		.maybeSingle();

	if (fetchError) throw fetchError;

	// 2. completed_sentences 배열 계산
	const currentCompleted = progress?.completed_sentences || [];
	let newCompleted: number[];

	if (isCompleted) {
		// 완료 상태: 배열에 추가 (중복 방지)
		newCompleted = currentCompleted.includes(sentenceOrder)
			? currentCompleted
			: [...currentCompleted, sentenceOrder].sort((a, b) => a - b);
	} else {
		// 미완료 상태: 배열에서 제거
		newCompleted = currentCompleted.filter((n) => n !== sentenceOrder);
	}

	// 3. user_progress 업데이트 또는 생성
	const { error: upsertError } = await supabase.from("user_progress").upsert(
		{
			user_id: userId,
			topic_id: topicId,
			completed_sentences: newCompleted,
		},
		{ onConflict: "user_id,topic_id" },
	);

	if (upsertError) throw upsertError;
}
