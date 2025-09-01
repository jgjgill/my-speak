"use client";

import Image from "next/image";
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
		<header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link
							href="/"
							className="flex items-center gap-3 hover:opacity-80 transition-opacity"
						>
							<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
								<Image
									src="/app-icon.png"
									alt="My Speak"
									width={40}
									height={40}
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<span className="text-xl font-bold text-blue-800">
									My Speak
								</span>
							</div>
						</Link>
					</div>

					<div className="flex items-center">
						<AuthButton />
					</div>
				</div>
			</div>
		</header>
	);
}
