import type { ReactNode } from "react";
import AppDownloadModal from "../components/app-download-modal";

interface LanguageLayoutProps {
	children: ReactNode;
}

export default function LanguageLayout({ children }: LanguageLayoutProps) {
	return (
		<>
			{children}
			<AppDownloadModal />
		</>
	);
}
