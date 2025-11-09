import type { ReactNode } from "react";
import AppDownloadModal from "@/shared/ui/modal/app-download-modal";

interface LanguageLayoutProps {
	children: ReactNode;
}

export default function LanguageHomeLayout({ children }: LanguageLayoutProps) {
	return (
		<>
			{children}
			<AppDownloadModal />
		</>
	);
}
