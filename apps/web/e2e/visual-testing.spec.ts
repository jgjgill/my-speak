import { expect, test } from "@playwright/test";

test.describe("시각적 테스트", () => {
	test("메인 페이지 스크린샷 테스트", async ({ page }) => {
		await page.goto("/");

		// 페이지 로딩 대기
		await expect(page.getByRole("heading", { name: "My Speak" })).toBeVisible();

		// 전체 페이지 스크린샷 (스크롤 포함)
		await page.screenshot({
			path: "./tests/screenshots/main-page-full.png",
			fullPage: true,
		});

		// 뷰포트만 스크린샷
		await page.screenshot({
			path: "./tests/screenshots/main-page-viewport.png",
		});
	});

	test("토픽 카드 개별 스크린샷", async ({ page }) => {
		await page.goto("/en/topics");

		// 토픽 카드 로딩 대기
		await expect(page.locator(".topic-card").first()).toBeVisible({
			timeout: 10000,
		});

		// 첫 번째 토픽 카드만 스크린샷
		await page.locator(".topic-card").first().screenshot({
			path: "./tests/screenshots/topic-card.png",
		});

		// 모든 토픽 카드 영역 스크린샷
		await page.locator("main").screenshot({
			path: "./tests/screenshots/topics-list.png",
		});
	});

	test("학습 페이지 단계별 스크린샷", async ({ page }) => {
		await page.goto("/en/topics");

		// 첫 번째 토픽으로 이동
		await page.locator('a[href*="/en/topics/"]').first().click();

		// 1단계 화면 스크린샷
		await page.screenshot({
			path: "./tests/screenshots/stage-1-practice.png",
			fullPage: true,
		});

		// 학습 포인트 버튼 클릭
		const learningPointButton = page.locator("button").filter({
			hasText: "메뉴를 봐도 될까요?",
		});

		if (await learningPointButton.isVisible()) {
			await learningPointButton.click();

			// 학습 포인트 활성화 후 스크린샷
			await page.screenshot({
				path: "./tests/screenshots/learning-point-active.png",
				fullPage: true,
			});
		}
	});

	test("반응형 디자인 테스트", async ({ page }) => {
		// 모바일 뷰포트
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");

		await page.screenshot({
			path: "./tests/screenshots/mobile-homepage.png",
		});

		// 태블릿 뷰포트
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto("/en/topics");

		await page.screenshot({
			path: "./tests/screenshots/tablet-topics.png",
		});

		// 데스크톱 뷰포트
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto("/");

		await page.screenshot({
			path: "./tests/screenshots/desktop-homepage.png",
		});
	});
});
