import type { PropsWithChildren } from "react";

import "./global.css";
import Link from "next/link";
import AuthButton from "./components/auth-button";
import { AuthProvider } from "./contexts/auth-context";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="ko">
			<body>
				<AuthProvider>
					<header className="border-b bg-white">
						<div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
							<h1 className="text-xl font-bold">
								<Link href="/" className="hover:text-blue-600">
									My Speak
								</Link>
							</h1>
							<AuthButton />
						</div>
					</header>
					<main>{children}</main>
				</AuthProvider>
			</body>
		</html>
	);
}
