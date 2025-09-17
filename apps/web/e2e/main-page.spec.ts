import { expect, test } from "@playwright/test";

test.describe("메인 페이지", () => {
	test("페이지 로딩 및 기본 요소 확인", async ({ page }) => {
		await page.goto("/");

		// 메인 타이틀 확인
		await expect(page.getByRole("heading", { name: "My Speak" })).toBeVisible();

		// 서브 타이틀 확인
		await expect(
			page.getByText("4단계 체계적 학습으로 외국어 스피킹을"),
		).toBeVisible();

		// 영어 학습 카드 확인
		await expect(page.getByText("영어 (English)")).toBeVisible();
		await expect(page.getByText("학습 시작하기")).toBeVisible();

		// 4단계 학습 시스템 설명 확인
		await expect(page.getByText("어떻게 학습하나요?")).toBeVisible();
		await expect(page.getByText("한글 번역")).toBeVisible();
		await expect(page.getByText("문장 완성")).toBeVisible();
		await expect(page.getByText("스피킹 연습")).toBeVisible();
		await expect(page.getByText("키워드 토킹")).toBeVisible();
	});

	test("영어 학습 링크 확인", async ({ page }) => {
		await page.goto("/");

		// 영어 학습 카드 클릭 가능한지 확인
		const englishLink = page.getByRole("link", { name: /영어.*English/ });
		await expect(englishLink).toBeVisible();

		// href 속성이 올바른지 확인
		await expect(englishLink).toHaveAttribute("href", "/en/topics");
	});

	test("앱 로고 및 이미지 로딩 확인", async ({ page }) => {
		await page.goto("/");

		// 앱 로고 이미지 확인
		const logo = page.getByAltText("My Speak 로고");
		await expect(logo).toBeVisible();
	});
});
