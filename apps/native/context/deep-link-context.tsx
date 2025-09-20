import * as Linking from "expo-linking";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useRef,
	useState,
} from "react";

interface DeepLinkContextType {
	hasProcessedDeepLink: boolean;
	initialPath: string | undefined;
	isDeepLinkEntry: boolean;
	processDeepLink: () => Promise<void>;
}

const DeepLinkContext = createContext<DeepLinkContextType | undefined>(
	undefined,
);

export function DeepLinkProvider({ children }: PropsWithChildren) {
	const hasProcessedRef = useRef(false);
	const [initialPath, setInitialPath] = useState<string | undefined>();

	const processDeepLink = async () => {
		if (hasProcessedRef.current) {
			console.log("📱 딥링크 이미 처리됨");
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

				hasProcessedRef.current = true;
			}
		} catch (error) {
			console.error("딥링크 처리 중 오류:", error);
		}
	};

	const value: DeepLinkContextType = {
		hasProcessedDeepLink: hasProcessedRef.current,
		initialPath,
		isDeepLinkEntry: !!initialPath && !hasProcessedRef.current,
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
