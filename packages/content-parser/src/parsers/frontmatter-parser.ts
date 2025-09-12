import matter from "gray-matter";
import type { ContentFrontmatter, ParsedContent } from "../types/content-types";

/**
 * frontmatter를 파싱하고 topic 정보와 highlight_sentence를 추출합니다.
 */
export function parseFrontmatter(fileContent: string): {
	frontmatter: ContentFrontmatter;
	content: string;
	topic: ParsedContent["topic"];
	highlight_sentences: ParsedContent["highlight_sentences"];
} {
	const { data: frontmatter, content } = matter(fileContent);

	// UUID 검증 함수
	function isValidUUID(uuid: string): boolean {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidRegex.test(uuid);
	}

	// topic_id 필수 검증
	const topicId = frontmatter.topic_id;

	if (!topicId) {
		throw new Error("topic_id is required in frontmatter");
	}

	if (typeof topicId !== "string") {
		throw new Error("topic_id must be a string");
	}

	if (!isValidUUID(topicId)) {
		throw new Error(`Invalid UUID format: ${topicId}`);
	}

	// topic 생성
	const topic: ParsedContent["topic"] = {
		id: topicId,
		title: frontmatter.title || "제목 없음",
		category: frontmatter.category || "기타",
		difficulty: frontmatter.difficulty || "초급",
		description: frontmatter.description,
		language_code: frontmatter.language_code || "en", // 기본값은 영어
		total_sentences: 0, // 나중에 업데이트됨
	};

	// highlight_sentences 생성
	const highlight_sentences: ParsedContent["highlight_sentences"] = [];
	if (frontmatter.highlight_sentence) {
		const highlight = frontmatter.highlight_sentence;
		highlight_sentences.push({
			sentence_order: highlight.sentence_order || 1,
			korean_text: highlight.korean_text || "",
			foreign_text: highlight.foreign_text || "",
			reason: highlight.reason || "",
		});
	}

	return {
		frontmatter,
		content,
		topic,
		highlight_sentences,
	};
}
