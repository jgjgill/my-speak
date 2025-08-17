"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWebView } from "../contexts/webview-context";
import AuthButton from "./auth-button";

export default function ConditionalHeader() {
	const { isWebView, hideHeader } = useWebView();
	const pathname = usePathname();

	if (isWebView && hideHeader) {
		return null;
	}

	if (pathname === "/login") {
		return null;
	}

	return (
		<header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 h-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link
							href="/"
							className="flex items-center gap-3 hover:opacity-80 transition-opacity"
						>
							<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<title>마이크 아이콘</title>
									<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 0 1 2 0zM12 18.1a1 1 0 0 1-1-1v-1.1a1 1 0 0 1 2 0v1.1a1 1 0 0 1-1 1z" />
								</svg>
							</div>
							<div>
								<h1 className="text-xl font-bold text-blue-800">My Speak</h1>
								<p className="text-xs text-gray-500 -mt-1">영어 스피킹 학습</p>
							</div>
						</Link>
					</div>

					<div className="flex items-center gap-4">
						<AuthButton />
					</div>
				</div>
			</div>
		</header>
	);
}
