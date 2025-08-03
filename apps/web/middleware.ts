import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * 다음을 제외한 모든 요청 경로에 일치:
		 * - _next/static (정적 파일)
		 * - _next/image (이미지 최적화 파일)
		 * - favicon.ico (파비콘 파일)
		 * 정적 파일의 Next.js 기본 경로와 일치하지 않는 경우 수정할 수 있습니다.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
