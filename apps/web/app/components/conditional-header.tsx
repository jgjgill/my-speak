"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWebView } from "@/shared/lib/webview";
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
		<>
			<div className="h-16" />
			<header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm fixed top-0 z-50 h-16 w-full">
				<div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
					<div className="flex justify-between items-center h-full">
						<div className="flex items-center">
							<Link
								href="/"
								className="flex items-center gap-3 hover:opacity-80 transition-opacity"
							>
								<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
									<Image
										src="/app-icon.png"
										alt="My Speak 로고"
										width={40}
										height={40}
										priority
									/>
								</div>
								<div>
									<span className="text-xl font-bold text-primary">
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
		</>
	);
}
