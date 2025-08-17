import type { PropsWithChildren } from "react";

import "./global.css";
import ConditionalHeader from "./components/conditional-header";
import NativeBridge from "./components/native-bridge";
import { AuthProvider } from "./contexts/auth-context";
import QueryProvider from "./providers/query-provider";
import { getCurrentUser } from "./utils/auth/server";

export default async function Layout({ children }: PropsWithChildren) {
	const initialUser = await getCurrentUser();
	return (
		<html lang="ko">
			<body>
				<QueryProvider>
					<AuthProvider initialUser={initialUser}>
						<NativeBridge />
						<ConditionalHeader />
						<main>{children}</main>
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
