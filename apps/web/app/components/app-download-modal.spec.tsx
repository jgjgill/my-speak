import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppDownloadModal from "./app-download-modal";

// 모킹
vi.mock("../utils/platform-client", () => ({
	isMobileWebClient: vi.fn(),
}));

vi.mock("../utils/deep-link", () => ({
	getDeviceType: vi.fn(),
	getStoreLinks: vi.fn(() => ({
		ios: "https://apps.apple.com/test",
		android: "https://play.google.com/test",
	})),
}));

const { isMobileWebClient } = await import("../utils/platform-client");
const { getDeviceType } = await import("../utils/deep-link");

describe("AppDownloadModal", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sessionStorage.clear();
		vi.mocked(isMobileWebClient).mockReturnValue(true);
		vi.mocked(getDeviceType).mockReturnValue("android");
	});

	afterEach(() => {
		cleanup();
	});

	describe("모바일웹 감지", () => {
		it("모바일웹이 아닐 때 모달이 표시되지 않음", () => {
			vi.mocked(isMobileWebClient).mockReturnValue(false);
			render(<AppDownloadModal />);
			expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
		});

		it("모바일웹일 때 모달이 표시됨", () => {
			render(<AppDownloadModal />);
			expect(screen.getByRole("alertdialog")).toBeInTheDocument();
		});
	});

	describe("sessionStorage 처리", () => {
		it("hideAppDownloadModal이 true일 때 모달이 표시되지 않음", () => {
			sessionStorage.setItem("hideAppDownloadModal", "true");
			render(<AppDownloadModal />);
			expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
		});
	});

	describe("접근성", () => {
		it("ESC 키로 모달을 닫을 수 있음", () => {
			render(<AppDownloadModal />);
			const modal = screen.getByRole("alertdialog");
			expect(modal).toBeInTheDocument();

			fireEvent.keyDown(document, { key: "Escape" });

			// sessionStorage에 설정되었는지 확인
			expect(sessionStorage.getItem("hideAppDownloadModal")).toBe("true");
		});

		it("적절한 ARIA 속성들이 설정됨", () => {
			render(<AppDownloadModal />);
			const modal = screen.getByRole("alertdialog");

			expect(modal).toHaveAttribute("aria-modal", "true");
			expect(modal).toHaveAttribute("aria-labelledby", "modal-title");
			expect(modal).toHaveAttribute("aria-describedby", "modal-description");
		});
	});

	describe("사용자 상호작용", () => {
		it("배경 클릭으로 모달을 닫을 수 있음", () => {
			render(<AppDownloadModal />);
			const modal = screen.getByRole("alertdialog");

			fireEvent.click(modal);

			expect(sessionStorage.getItem("hideAppDownloadModal")).toBe("true");
		});

		it("닫기 버튼 클릭으로 모달을 닫을 수 있음", () => {
			render(<AppDownloadModal />);
			const closeButton = screen.getByLabelText("모달 닫기");

			fireEvent.click(closeButton);

			expect(sessionStorage.getItem("hideAppDownloadModal")).toBe("true");
		});

		it("웹에서 계속하기 버튼으로 모달을 닫을 수 있음", () => {
			render(<AppDownloadModal />);
			const continueButton = screen.getByText("웹에서 계속하기");

			fireEvent.click(continueButton);

			expect(sessionStorage.getItem("hideAppDownloadModal")).toBe("true");
		});
	});

	describe("디바이스별 스토어 링크", () => {
		it("iOS 디바이스에서 App Store 링크를 표시함", () => {
			vi.mocked(getDeviceType).mockReturnValue("ios");
			render(<AppDownloadModal />);

			expect(screen.getByText("App Store")).toBeInTheDocument();
			expect(screen.queryByText("Play Store")).not.toBeInTheDocument();
		});

		it("Android 디바이스에서 Play Store 링크를 표시함", () => {
			vi.mocked(getDeviceType).mockReturnValue("android");
			render(<AppDownloadModal />);

			expect(screen.getByText("Play Store")).toBeInTheDocument();
			expect(screen.queryByText("App Store")).not.toBeInTheDocument();
		});
	});

	describe("애니메이션", () => {
		it("초기 렌더링 시 slide-up 애니메이션 클래스가 적용됨", () => {
			render(<AppDownloadModal />);
			const modalContent = screen.getByRole("alertdialog").firstElementChild;

			expect(modalContent).toHaveClass("animate-slide-up");
			expect(modalContent).not.toHaveClass("animate-slide-down");
		});
	});
});
