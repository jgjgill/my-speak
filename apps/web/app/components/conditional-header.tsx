"use client";

import Link from "next/link";
import { useWebView } from "../contexts/webview-context";
import AuthButton from "./auth-button";

export default function ConditionalHeader() {
	const { isWebView, hideHeader } = useWebView();

	if (isWebView && hideHeader) {
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
