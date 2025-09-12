import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "../../src/parsers/frontmatter-parser.js";

describe("frontmatter-parser", () => {
	const sampleContent = readFileSync(
		join(__dirname, "../fixtures/sample-content.md"),
		"utf-8",
	);

	describe("정상 케이스 - sample-content.md 사용", () => {
		it("frontmatter를 올바르게 파싱해야 함", () => {
			const result = parseFrontmatter(sampleContent);

			// topic 검증
			expect(result.topic.id).toBe("550e8400-e29b-41d4-a716-446655440000");
			expect(result.topic.title).toBe("테스트 콘텐츠");
			expect(result.topic.category).toBe("테스트");
			expect(result.topic.difficulty).toBe("초급");
			expect(result.topic.description).toBe("테스트용 콘텐츠입니다.");
			expect(result.topic.total_sentences).toBe(0);
		});

		it("highlight_sentence를 올바르게 파싱해야 함", () => {
			const result = parseFrontmatter(sampleContent);

			expect(result.highlight_sentences).toHaveLength(1);
			expect(result.highlight_sentences[0]).toEqual({
				sentence_order: 2,
				korean_text: "이것은 테스트 문장입니다",
				foreign_text: "This is a test sentence",
				reason: "테스트용 핵심 문장입니다",
			});
		});

		it("content 본문을 올바르게 분리해야 함", () => {
			const result = parseFrontmatter(sampleContent);

			expect(result.content).toContain("# 1단계: 한글 스크립트");
			expect(result.content).toContain("**테스트 문장**{test sentence}");
			expect(result.content).toContain("# 4단계: 키워드 스피치");

			// frontmatter는 제거되어야 함
			expect(result.content).not.toContain("topic_id:");
		});
	});

	describe("UUID 필수 검증", () => {
		it("topic_id가 없으면 에러를 발생시켜야 함", () => {
			const noUuidContent = sampleContent.replace(
				'topic_id: "550e8400-e29b-41d4-a716-446655440000"\n',
				"",
			);

			expect(() => parseFrontmatter(noUuidContent)).toThrow(
				"topic_id is required in frontmatter",
			);
		});

		it("topic_id가 문자열이 아니면 에러를 발생시켜야 함", () => {
			const numericUuidContent = sampleContent.replace(
				'topic_id: "550e8400-e29b-41d4-a716-446655440000"',
				"topic_id: 12345",
			);

			expect(() => parseFrontmatter(numericUuidContent)).toThrow(
				"topic_id must be a string",
			);
		});

		it("잘못된 UUID 형식이면 에러를 발생시켜야 함", () => {
			const invalidUuidContent = sampleContent.replace(
				'topic_id: "550e8400-e29b-41d4-a716-446655440000"',
				'topic_id: "invalid-uuid-format"',
			);

			expect(() => parseFrontmatter(invalidUuidContent)).toThrow(
				"Invalid UUID format: invalid-uuid-format",
			);
		});

		it("유효한 UUID 형식은 정상 처리해야 함", () => {
			const validUuidContent = sampleContent.replace(
				'topic_id: "550e8400-e29b-41d4-a716-446655440000"',
				'topic_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479"',
			);

			const result = parseFrontmatter(validUuidContent);
			expect(result.topic.id).toBe("f47ac10b-58cc-4372-a567-0e02b2c3d479");
		});
	});

	describe("기본값 처리", () => {
		it("title이 없을 때 기본값을 사용해야 함", () => {
			const noTitleContent = sampleContent.replace(
				'title: "테스트 콘텐츠"\n',
				"",
			);

			const result = parseFrontmatter(noTitleContent);
			expect(result.topic.title).toBe("제목 없음");
		});

		it("category가 없을 때 기본값을 사용해야 함", () => {
			const noCategoryContent = sampleContent.replace(
				'category: "테스트"\n',
				"",
			);

			const result = parseFrontmatter(noCategoryContent);
			expect(result.topic.category).toBe("기타");
		});

		it("difficulty가 없을 때 기본값을 사용해야 함", () => {
			const noDifficultyContent = sampleContent.replace(
				'difficulty: "초급"\n',
				"",
			);

			const result = parseFrontmatter(noDifficultyContent);
			expect(result.topic.difficulty).toBe("초급");
		});

		it("highlight_sentence가 없을 때 빈 배열을 반환해야 함", () => {
			const noHighlightContent = sampleContent.replace(
				/highlight_sentence:[\s\S]*?reason: "테스트용 핵심 문장입니다"\n/,
				"",
			);

			const result = parseFrontmatter(noHighlightContent);
			expect(result.highlight_sentences).toHaveLength(0);
		});
	});
});
