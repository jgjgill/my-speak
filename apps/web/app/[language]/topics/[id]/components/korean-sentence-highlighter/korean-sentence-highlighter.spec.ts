import type { Tables } from "@repo/typescript-config/supabase-types";
import { describe, expect, it } from "vitest";
import {
	findKeywordAtPosition,
	getLearningPointInfo,
	getLearningPointKeywords,
	isSelectedLearningPoint,
	parseTextSegments,
} from "./korean-sentence-highlighter.utils";

type LearningPoint = Tables<"learning_points">;

// 공통 테스트 데이터
const mockLearningPoint1: LearningPoint = {
	id: "test-1",
	korean_phrase: "월세가 얼마",
	foreign_phrase: "how much is the rent",
	sentence_order: 1,
	topic_id: "topic-1",
	created_at: "2024-01-01",
} as LearningPoint;

const mockLearningPoint2: LearningPoint = {
	id: "test-2",
	korean_phrase: "보증금",
	foreign_phrase: "security deposit",
	sentence_order: 1,
	topic_id: "topic-1",
	created_at: "2024-01-01",
} as LearningPoint;

const mockLearningPoints = [mockLearningPoint1, mockLearningPoint2];

describe("korean-sentence-highlighter utils", () => {
	describe("getLearningPointKeywords", () => {
		it("learning points에서 키워드를 추출해야 한다", () => {
			const result = getLearningPointKeywords(mockLearningPoints);

			expect(result).toEqual(["월세가 얼마", "보증금"]);
		});

		it("빈 배열에서는 빈 배열을 반환해야 한다", () => {
			const result = getLearningPointKeywords([]);

			expect(result).toEqual([]);
		});
	});

	describe("getLearningPointInfo", () => {
		it("텍스트와 일치하는 learning point를 찾아야 한다", () => {
			const result = getLearningPointInfo("월세가 얼마", mockLearningPoints);

			expect(result).toEqual(mockLearningPoint1);
		});

		it("일치하지 않으면 에러를 던져야 한다", () => {
			expect(() => {
				getLearningPointInfo("존재하지 않는 텍스트", mockLearningPoints);
			}).toThrow('Learning point not found for text: "존재하지 않는 텍스트"');
		});
	});

	describe("isSelectedLearningPoint", () => {
		it("선택된 포인트는 true를 반환해야 한다", () => {
			const selectedPoints = new Set(["1-test-1"]); // sentenceOrder-id 형식

			const result = isSelectedLearningPoint(
				mockLearningPoint1,
				1,
				selectedPoints,
			);

			expect(result).toBe(true);
		});

		it("선택되지 않은 포인트는 false를 반환해야 한다", () => {
			const selectedPoints = new Set<string>();

			const result = isSelectedLearningPoint(
				mockLearningPoint1,
				1,
				selectedPoints,
			);

			expect(result).toBe(false);
		});
	});

	describe("findKeywordAtPosition", () => {
		it("요구사항에 대한 테스트 명세 작성...", () => {});
	});

	describe("findKeywordAtPosition", () => {
		it("특정 위치에서 키워드를 찾아야 한다", () => {
			const result = findKeywordAtPosition("월세가 얼마인지 궁금해요", 0, [
				"월세가 얼마",
				"보증금",
			]);

			expect(result).toBe("월세가 얼마");
		});

		it("긴 키워드를 우선해야 한다", () => {
			const result = findKeywordAtPosition("월세가 얼마", 0, [
				"월세",
				"월세가 얼마",
			]);

			expect(result).toBe("월세가 얼마");
		});

		it("키워드가 없으면 undefined를 반환해야 한다", () => {
			const result = findKeywordAtPosition("일반 텍스트", 0, [
				"월세가 얼마",
				"보증금",
			]);

			expect(result).toBeUndefined();
		});

		it("중간 위치에서 키워드를 찾아야 한다", () => {
			const result = findKeywordAtPosition("그리고 보증금은 얼마인가요?", 4, [
				"보증금",
				"월세",
			]);

			expect(result).toBe("보증금");
		});
	});
});

describe("parseTextSegments", () => {
	describe("기본 동작", () => {
		it("키워드가 없을 때 전체 텍스트를 하나의 세그먼트로 반환해야 한다", () => {
			const result = parseTextSegments(
				"이것은 테스트입니다",
				1,
				[], // 빈 learningPoints 배열
				new Set(),
			);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				text: "이것은 테스트입니다",
				isKeyword: false,
				isSelected: false,
			});
		});

		it('실제 예시: "월세가 얼마인지와 보증금은..." 텍스트를 올바르게 분리해야 한다', () => {
			const selectedPoints = new Set(["1-test-1"]); // "월세가 얼마"만 선택된 상태

			const result = parseTextSegments(
				"월세가 얼마인지와 보증금은 얼마나 되는지 알고 싶습니다.",
				1,
				mockLearningPoints,
				selectedPoints,
			);

			expect(result).toHaveLength(4);

			// "월세가 얼마" - 키워드, 선택됨
			expect(result[0]).toEqual({
				text: "월세가 얼마",
				isKeyword: true,
				learningPoint: mockLearningPoint1,
				isSelected: true,
			});

			// "인지와 " - 일반 텍스트
			expect(result[1]).toEqual({
				text: "인지와 ",
				isKeyword: false,
				isSelected: false,
			});

			// "보증금" - 키워드, 선택되지 않음
			expect(result[2]).toEqual({
				text: "보증금",
				isKeyword: true,
				learningPoint: mockLearningPoint2,
				isSelected: false,
			});

			// "은 얼마나 되는지 알고 싶습니다." - 일반 텍스트
			expect(result[3]).toEqual({
				text: "은 얼마나 되는지 알고 싶습니다.",
				isKeyword: false,
				isSelected: false,
			});
		});

		it("두 키워드 모두 선택된 상태를 처리해야 한다", () => {
			const selectedPoints = new Set(["1-test-1", "1-test-2"]); // 모든 키워드 선택됨

			const result = parseTextSegments(
				"월세가 얼마인지와 보증금은 얼마나 되는지 알고 싶습니다.",
				1,
				mockLearningPoints,
				selectedPoints,
			);

			expect(result[0]?.isSelected).toBe(true); // 월세가 얼마
			expect(result[2]?.isSelected).toBe(true); // 보증금
		});

		it("키워드가 모두 선택되지 않은 상태를 처리해야 한다", () => {
			const selectedPoints = new Set<string>(); // 모든 키워드 선택되지 않음

			const result = parseTextSegments(
				"월세가 얼마인지와 보증금은 얼마나 되는지 알고 싶습니다.",
				1,
				mockLearningPoints,
				selectedPoints,
			);

			expect(result[0]?.isSelected).toBe(false); // 월세가 얼마
			expect(result[2]?.isSelected).toBe(false); // 보증금
		});
	});

	describe("키워드 매칭", () => {
		it("정확히 일치하는 키워드만 매칭해야 한다", () => {
			const learningPointsOnlyRent = [mockLearningPoint1]; // "월세가 얼마"만 포함

			const result = parseTextSegments(
				"월세가 얼마인지와 월세 정보",
				1,
				learningPointsOnlyRent,
				new Set(),
			);

			// "월세가 얼마"는 매칭, "월세"는 매칭되지 않음
			expect(result[0]?.text).toBe("월세가 얼마");
			expect(result[0]?.isKeyword).toBe(true);
			expect(result[1]?.text).toBe("인지와 월세 정보");
			expect(result[1]?.isKeyword).toBe(false);
		});

		it("첫 번째 발견된 키워드만 처리해야 한다", () => {
			const learningPointsOnlyDeposit = [mockLearningPoint2]; // "보증금"만 포함

			const result = parseTextSegments(
				"보증금과 보증금 정보",
				1,
				learningPointsOnlyDeposit,
				new Set(),
			);

			expect(result[0]?.text).toBe("보증금");
			expect(result[0]?.isKeyword).toBe(true);
			expect(result[1]?.text).toBe("과 보증금 정보");
			expect(result[1]?.isKeyword).toBe(false);
		});
	});

	describe("독립적인 토글 동작", () => {
		it("각 키워드가 독립적으로 토글되어야 한다", () => {
			// "보증금"만 선택된 상태 시뮬레이션
			const selectedPoints = new Set(["1-test-2"]); // test-2는 보증금 ID

			const result = parseTextSegments(
				"월세가 얼마인지와 보증금은 얼마나 되는지 알고 싶습니다.",
				1,
				mockLearningPoints,
				selectedPoints,
			);

			expect(result[0]?.isSelected).toBe(false); // 월세가 얼마 - 선택되지 않음
			expect(result[2]?.isSelected).toBe(true); // 보증금 - 선택됨
		});
	});
});
