import type { Tables } from "@repo/typescript-config/supabase-types";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import KoreanSentenceHighlighter from "./korean-sentence-highlighter";
import { parseTextSegments } from "./korean-sentence-highlighter.utils";

type LearningPoint = Tables<"learning_points">;

const mockLearningPoint: LearningPoint = {
	id: "test-1",
	korean_phrase: "월세가 얼마",
	foreign_phrase: "how much is the rent",
	sentence_order: 1,
	topic_id: "topic-1",
	created_at: "2024-01-01",
} as LearningPoint;

describe("parseTextSegments", () => {
	it("parses text with learning points", () => {
		const result = parseTextSegments(
			"월세가 얼마인지 궁금해요",
			1,
			[mockLearningPoint],
			new Set(),
		);

		expect(result[0]).toEqual({
			text: "월세가 얼마",
			isKeyword: true,
			learningPoint: mockLearningPoint,
			isSelected: false,
		});
		expect(result[1]).toEqual({
			text: "인지 궁금해요",
			isKeyword: false,
			isSelected: false,
		});
	});
});

describe("KoreanSentenceHighlighter", () => {
	it("calls onClick when clicked", () => {
		const onLearningPointClick = vi.fn();

		render(
			<KoreanSentenceHighlighter
				sentenceOrder={1}
				koreanText="월세가 얼마인지 궁금해요"
				learningPoints={[mockLearningPoint]}
				selectedPoints={new Set()}
				onLearningPointClick={onLearningPointClick}
				isLoading={false}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "월세가 얼마" }));
		expect(onLearningPointClick).toHaveBeenCalledWith(1, "월세가 얼마");
	});

	it("disables buttons when loading", () => {
		const onLearningPointClick = vi.fn();

		const { container } = render(
			<KoreanSentenceHighlighter
				sentenceOrder={1}
				koreanText="월세가 얼마인지 궁금해요"
				learningPoints={[mockLearningPoint]}
				selectedPoints={new Set()}
				onLearningPointClick={onLearningPointClick}
				isLoading={true}
			/>,
		);

		const button = container.querySelector("button[disabled]");
		expect(button).toBeDisabled();

		if (button) fireEvent.click(button);
		expect(onLearningPointClick).not.toHaveBeenCalled();
	});
});
