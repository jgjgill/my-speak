import type { Database } from "@repo/typescript-config/supabase-types";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import type { ParsedContent } from "../types/content-types.js";

// 환경 변수 로드
config({ path: ".env.local" });

// Supabase 클라이언트 생성
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * 파싱된 콘텐츠를 Supabase에 업로드합니다.
 */
export async function uploadToSupabase(data: ParsedContent) {
	try {
		// 1. Topic 업로드
		const topicData = await uploadTopic(data.topic);
		const topicId = topicData.id;

		// 2. 각 테이블에 데이터 업로드
		await Promise.all([
			uploadKoreanScripts(data.korean_scripts, topicId),
			uploadForeignScripts(data.foreign_scripts, topicId),
			uploadKeywordSpeeches(data.keyword_speeches, topicId),
			uploadLearningPoints(data.learning_points, topicId),
			uploadHighlightSentences(data.highlight_sentences, topicId),
		]);

		console.log("✅ All data uploaded successfully!");
		return topicData;
	} catch (error) {
		console.error("❌ Upload failed:", error);
		throw error;
	}
}

/**
 * Topic을 업로드합니다.
 */
async function uploadTopic(topic: ParsedContent["topic"]) {
	const { data: topicData, error: topicError } = await supabase
		.from("topics")
		.upsert(topic)
		.select()
		.single();

	if (topicError) throw topicError;
	return topicData;
}

/**
 * Korean Scripts를 업로드합니다.
 */
async function uploadKoreanScripts(
	scripts: ParsedContent["korean_scripts"],
	topicId: string,
) {
	if (scripts.length === 0) return;

	const scriptsWithTopicId = scripts.map((script) => ({
		...script,
		topic_id: topicId,
	}));

	const { error } = await supabase
		.from("korean_scripts")
		.upsert(scriptsWithTopicId, {
			onConflict: "topic_id,sentence_order",
		});

	if (error) throw error;
	console.log("Korean scripts inserted:", scripts.length);
}

/**
 * Foreign Scripts를 업로드합니다.
 */
async function uploadForeignScripts(
	scripts: ParsedContent["foreign_scripts"],
	topicId: string,
) {
	if (scripts.length === 0) return;

	const scriptsWithTopicId = scripts.map((script) => ({
		...script,
		topic_id: topicId,
	}));

	const { error } = await supabase
		.from("foreign_scripts")
		.upsert(scriptsWithTopicId, {
			onConflict: "topic_id,sentence_order",
		});

	if (error) throw error;
	console.log("Foreign scripts inserted:", scripts.length);
}

/**
 * Keyword Speeches를 업로드합니다.
 */
async function uploadKeywordSpeeches(
	speeches: ParsedContent["keyword_speeches"],
	topicId: string,
) {
	if (speeches.length === 0) return;

	const speechesWithTopicId = speeches.map((speech) => ({
		...speech,
		topic_id: topicId,
	}));

	const { error } = await supabase
		.from("keyword_speeches")
		.upsert(speechesWithTopicId, {
			onConflict: "topic_id,stage,level,sequence_order",
		});

	if (error) throw error;
	console.log("Keyword speeches inserted:", speeches.length);
}

/**
 * Learning Points를 업로드합니다.
 */
async function uploadLearningPoints(
	points: ParsedContent["learning_points"],
	topicId: string,
) {
	if (points.length === 0) return;

	const pointsWithTopicId = points.map((point) => ({
		...point,
		topic_id: topicId,
	}));

	const { error } = await supabase
		.from("learning_points")
		.upsert(pointsWithTopicId, {
			onConflict: "topic_id,sentence_order,korean_phrase",
		});

	if (error) throw error;
	console.log("Learning points inserted:", points.length);
}

/**
 * Highlight Sentences를 업로드합니다.
 */
async function uploadHighlightSentences(
	sentences: ParsedContent["highlight_sentences"],
	topicId: string,
) {
	if (sentences.length === 0) return;

	const sentencesWithTopicId = sentences.map((sentence) => ({
		...sentence,
		topic_id: topicId,
	}));

	const { error } = await supabase
		.from("highlight_sentences")
		.upsert(sentencesWithTopicId, {
			onConflict: "topic_id",
		});

	if (error) throw error;
	console.log("Highlight sentences inserted:", sentences.length);
}
