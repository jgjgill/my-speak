import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TextHighlighter from "./text-highlighter";
import {
	createSegmentsFromMatches,
	findKeywordMatches,
	parseTextWithKeywords,
} from "./text-highlighter.utils";

describe("findKeywordMatches", () => {
	it("단일 키워드 매칭 위치를 찾는다", () => {
		const text = "안녕하세요 반가워요";
		const keywords = ["반가워요"];
		const result = findKeywordMatches(text, keywords);

		expect(result).toEqual([{ start: 6, end: 10, keyword: "반가워요" }]);
	});

	it("중복 키워드 매칭에서 긴 키워드를 우선한다", () => {
		const text = "안녕하세요. 오늘 하루도 안녕히 보내세요";
		const keywords = ["안녕하세요", "안녕"];
		const result = findKeywordMatches(text, keywords);

		expect(result).toEqual([
			{ start: 0, end: 5, keyword: "안녕하세요" },
			{ start: 14, end: 16, keyword: "안녕" },
		]);
	});

	it("매칭되는 키워드가 없으면 빈 배열을 반환한다", () => {
		const text = "안녕하세요 반가워요";
		const keywords = ["없는키워드"];
		const result = findKeywordMatches(text, keywords);

		expect(result).toEqual([]);
	});
});

describe("createSegmentsFromMatches", () => {
	it("매칭이 없을 때 전체 텍스트를 하나의 세그먼트로 반환한다", () => {
		const text = "안녕하세요 반가워요";
		const matches: Array<{ start: number; end: number; keyword: string }> = [];
		const result = createSegmentsFromMatches(text, matches);

		expect(result).toEqual([{ text: "안녕하세요 반가워요", isKeyword: false }]);
	});

	it("매칭 정보를 바탕으로 세그먼트를 생성한다", () => {
		const text = "안녕하세요. 오늘 하루도 안녕히 보내세요";
		const matches = [
			{ start: 0, end: 5, keyword: "안녕하세요" },
			{ start: 14, end: 16, keyword: "안녕" },
		];
		const result = createSegmentsFromMatches(text, matches);

		expect(result).toEqual([
			{ text: "안녕하세요", isKeyword: true },
			{ text: ". 오늘 하루도 ", isKeyword: false },
			{ text: "안녕", isKeyword: true },
			{ text: "히 보내세요", isKeyword: false },
		]);
	});
});

describe("parseTextWithKeywords", () => {
	it("키워드가 없을 때 전체 텍스트를 하나의 세그먼트로 반환한다", () => {
		const result = parseTextWithKeywords("안녕하세요 반가워요", []);
		expect(result).toEqual([{ text: "안녕하세요 반가워요", isKeyword: false }]);
	});

	it("중복되는 키워드를 문장 내에서 각각 처리한다", () => {
		const text = "안녕하세요. 오늘 하루도 안녕히 보내세요";
		const result = parseTextWithKeywords(text, ["안녕하세요", "안녕"]);

		expect(result).toEqual([
			{ text: "안녕하세요", isKeyword: true },
			{ text: ". 오늘 하루도 ", isKeyword: false },
			{ text: "안녕", isKeyword: true },
			{ text: "히 보내세요", isKeyword: false },
		]);
	});
});

describe("TextHighlighter", () => {
	it("키워드가 없을 때 일반 텍스트만 렌더링한다", () => {
		const { container } = render(
			<TextHighlighter text="안녕하세요 반가워요" keywords={[]} />,
		);

		expect(container.textContent).toBe("안녕하세요 반가워요");
		expect(container.querySelector(".bg-orange-200")).toBeNull();
	});

	it("단일 키워드를 강조하여 렌더링한다", () => {
		const { container } = render(
			<TextHighlighter text="안녕하세요 반가워요" keywords={["반가워요"]} />,
		);

		expect(container.textContent).toBe("안녕하세요 반가워요");

		const highlightedElement = container.querySelector(".bg-orange-200");
		expect(highlightedElement).not.toBeNull();
		expect(highlightedElement?.textContent).toBe("반가워요");
	});
});
