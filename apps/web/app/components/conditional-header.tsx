"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AuthButton from "./auth-button";

function HeaderContent() {
	const searchParams = useSearchParams();
	const isNative = searchParams.get("native") === "true";
	const hideHeader = searchParams.get("hideHeader") === "true";

	// 네이티브 앱에서 헤더 숨김 요청이 있으면 헤더를 렌더링하지 않음
	if (isNative && hideHeader) {
		return null;
	}

	return (
		<header className="border-b bg-white h-16">
			<div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
				<h1 className="text-xl font-bold">
					<Link href="/" className="hover:text-blue-600">
						My Speak
					</Link>
				</h1>
				<AuthButton />
			</div>
		</header>
	);
}

export default function ConditionalHeader() {
	return (
		<Suspense fallback={null}>
			<HeaderContent />
		</Suspense>
	);
}
