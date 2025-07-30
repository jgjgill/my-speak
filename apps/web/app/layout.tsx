import type { PropsWithChildren } from "react";

import "./global.css";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="ko">
			<body>{children}</body>
		</html>
	);
}
