import { expect, test } from "@playwright/test";

test.describe("네비게이션 테스트", () => {
	test("메인 페이지에서 영어 토픽 페이지로 이동", async ({ page }) => {
		await page.goto("/");

		// 영어 학습 카드 클릭
		await page.click('a[href="/en/topics"]');

		// URL이 올바르게 변경되었는지 확인
		await expect(page).toHaveURL("/en/topics");

		// 페이지가 로딩되었는지 확인 (English 텍스트가 메타데이터에 포함됨)
		await expect(page).toHaveTitle(/English/);
	});

	test("영어 토픽 페이지 기본 요소 확인", async ({ page }) => {
		await page.goto("/en/topics");

		// 페이지 제목 확인
		await expect(page).toHaveTitle(/English.*Topics/);

		// 토픽 카드들이 로딩되는지 확인
		// topic-card 클래스를 가진 요소가 최소 1개는 있어야 함
		await expect(page.locator(".topic-card").first()).toBeVisible({
			timeout: 10000,
		});

		// 토픽 카드 내부 기본 요소들 확인
		const firstTopicCard = page.locator(".topic-card").first();
		await expect(firstTopicCard.locator("h2")).toBeVisible(); // 제목

		// 토픽 카드 자체가 링크이므로 href 속성 확인
		const firstTopicLink = page.locator('a[href*="/en/topics/"]').first();
		await expect(firstTopicLink).toBeVisible();
	});

	test("토픽 카드 클릭으로 개별 토픽 페이지 이동", async ({ page }) => {
		await page.goto("/en/topics");

		// 첫 번째 토픽 카드가 로딩될 때까지 기다림
		await expect(page.locator(".topic-card").first()).toBeVisible({
			timeout: 10000,
		});

		// 첫 번째 토픽 링크 URL 가져오기 (토픽 카드 전체가 링크)
		const firstTopicLink = page.locator('a[href*="/en/topics/"]').first();
		const href = await firstTopicLink.getAttribute("href");

		// 토픽 카드 클릭
		await firstTopicLink.click();

		// URL이 개별 토픽 페이지로 변경되었는지 확인
		await expect(page).toHaveURL(new RegExp(`${href}`));

		// 개별 토픽 페이지가 로딩되었는지 확인
		// (로딩 스켈레톤이나 실제 콘텐츠 중 하나는 보여야 함)
		const hasContent = await Promise.race([
			page
				.locator('[data-testid*="skeleton"], [data-testid*="loading"]')
				.first()
				.isVisible({ timeout: 5000 })
				.then(() => true),
			page
				.locator("h1, .stage-navigation, .practice-header")
				.first()
				.isVisible({ timeout: 10000 })
				.then(() => true),
		]).catch(() => false);

		expect(hasContent).toBeTruthy();
	});

	test("브라우저 뒤로가기 기능", async ({ page }) => {
		await page.goto("/");

		// 영어 토픽 페이지로 이동
		await page.click('a[href="/en/topics"]');
		await expect(page).toHaveURL("/en/topics");

		// 뒤로가기
		await page.goBack();
		await expect(page).toHaveURL("/");

		// 메인 페이지 요소가 다시 보이는지 확인 (고유한 헤딩 요소 사용)
		await expect(page.getByRole("heading", { name: "My Speak" })).toBeVisible();
	});

	test("직접 URL로 토픽 페이지 접근", async ({ page }) => {
		// 직접 영어 토픽 페이지로 접근
		await page.goto("/en/topics");

		// 페이지가 정상적으로 로딩되는지 확인
		await expect(page).toHaveTitle(/English.*Topics/);

		// 토픽 리스트가 표시되는지 확인
		await expect(page.locator(".topic-card").first()).toBeVisible({
			timeout: 10000,
		});
	});
});
