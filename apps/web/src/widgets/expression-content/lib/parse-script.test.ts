import { describe, expect, it } from "vitest";
import { parseScript } from "./parse-script";

const makeBlanks = (items: Array<{ text: string; order: number }>) =>
	items.map((item) => ({
		id: `id-${item.order}`,
		expression_id: "expr-1",
		blank_text: item.text,
		sequence_order: item.order,
	}));

describe("parseScript", () => {
	it("빈칸 패턴이 없으면 전체를 텍스트로 반환한다", () => {
		const result = parseScript("Hello world", []);

		expect(result).toEqual([{ type: "text", value: "Hello world" }]);
	});

	it("빈칸 패턴 하나를 파싱한다", () => {
		const blanks = makeBlanks([{ text: "going to", order: 1 }]);
		const script = "I'm **going to**{1} the store.";

		const result = parseScript(script, blanks);

		expect(result).toEqual([
			{ type: "text", value: "I'm " },
			{ type: "blank", blank: blanks[0] },
			{ type: "text", value: " the store." },
		]);
	});

	it("여러 빈칸 패턴을 순서대로 파싱한다", () => {
		const blanks = makeBlanks([
			{ text: "going to", order: 1 },
			{ text: "pick up", order: 2 },
		]);
		const script =
			"I'm **going to**{1} the store to **pick up**{2} some groceries.";

		const result = parseScript(script, blanks);

		expect(result).toEqual([
			{ type: "text", value: "I'm " },
			{ type: "blank", blank: blanks[0] },
			{ type: "text", value: " the store to " },
			{ type: "blank", blank: blanks[1] },
			{ type: "text", value: " some groceries." },
		]);
	});

	it("스크립트가 빈칸으로 시작하는 경우를 처리한다", () => {
		const blanks = makeBlanks([{ text: "Let me", order: 1 }]);
		const script = "**Let me**{1} help you.";

		const result = parseScript(script, blanks);

		expect(result).toEqual([
			{ type: "blank", blank: blanks[0] },
			{ type: "text", value: " help you." },
		]);
	});

	it("스크립트가 빈칸으로 끝나는 경우를 처리한다", () => {
		const blanks = makeBlanks([{ text: "right now", order: 1 }]);
		const script = "I need it **right now**{1}";

		const result = parseScript(script, blanks);

		expect(result).toEqual([
			{ type: "text", value: "I need it " },
			{ type: "blank", blank: blanks[0] },
		]);
	});

	it("blanks 배열이 순서가 섞여있어도 sequence_order 순으로 파싱한다", () => {
		const blanks = makeBlanks([
			{ text: "pick up", order: 2 },
			{ text: "going to", order: 1 },
		]);
		const script =
			"I'm **going to**{1} the store to **pick up**{2} some groceries.";

		const result = parseScript(script, blanks);

		expect(result).toEqual([
			{ type: "text", value: "I'm " },
			{ type: "blank", blank: blanks[1] },
			{ type: "text", value: " the store to " },
			{ type: "blank", blank: blanks[0] },
			{ type: "text", value: " some groceries." },
		]);
	});

	it("스크립트에 매칭되지 않는 blank는 무시한다", () => {
		const blanks = makeBlanks([
			{ text: "going to", order: 1 },
			{ text: "nonexistent", order: 99 },
		]);
		const script = "I'm **going to**{1} the store.";

		const result = parseScript(script, blanks);

		expect(result).toEqual([
			{ type: "text", value: "I'm " },
			{ type: "blank", blank: blanks[0] },
			{ type: "text", value: " the store." },
		]);
	});
});
