import * as Linking from "expo-linking";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useRef,
	useState,
} from "react";

interface DeepLinkContextType {
	initialPath: string | undefined;
	processDeepLink: () => Promise<void>;
}

const DeepLinkContext = createContext<DeepLinkContextType | undefined>(
	undefined,
);

export function DeepLinkProvider({ children }: PropsWithChildren) {
	const [initialPath, setInitialPath] = useState<string | undefined>();
	const hasProcessedRef = useRef(false);

	const processDeepLink = async () => {
		if (hasProcessedRef.current) {
			console.log("📱 딥링크 이미 처리됨, initialPath 초기화");
			setInitialPath(undefined);
			return;
		}

		try {
			const initialUrl = await Linking.getInitialURL();

			if (initialUrl) {
				console.log("📱 딥링크로 앱 시작:", initialUrl);
				const parsed = Linking.parse(initialUrl);
				const pathParam = parsed.queryParams?.path;

				if (pathParam && typeof pathParam === "string") {
					console.log("📱 추출된 초기 경로:", pathParam);
					setInitialPath(pathParam);
				}
			}

			hasProcessedRef.current = true;
		} catch (error) {
			console.error("딥링크 처리 중 오류:", error);
			hasProcessedRef.current = true;
		}
	};

	const value: DeepLinkContextType = {
		initialPath,
		processDeepLink,
	};

	return (
		<DeepLinkContext.Provider value={value}>
			{children}
		</DeepLinkContext.Provider>
	);
}

export function useDeepLink() {
	const context = useContext(DeepLinkContext);
	if (!context) {
		throw new Error("useDeepLink must be used within DeepLinkProvider");
	}
	return context;
}
