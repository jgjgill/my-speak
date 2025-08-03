import type { PropsWithChildren } from "react";

import "./global.css";
import { AuthProvider } from "./contexts/auth-context";
import AuthButton from "./components/auth-button";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="ko">
			<body>
				<AuthProvider>
					<header className="border-b bg-white">
						<div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
							<h1 className="text-xl font-bold">
								<a href="/" className="hover:text-blue-600">
									My Speak
								</a>
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
