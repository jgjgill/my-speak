"use client";

import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react";

export interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info";
	duration?: number;
	isExiting?: boolean;
}

interface ToastContextValue {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren<unknown>) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = (toast: Omit<Toast, "id">) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newToast = { ...toast, id };

		setToasts((prev) => [...prev, newToast]);

		// Auto remove toast after duration (default 3 seconds)
		setTimeout(() => {
			removeToast(id);
		}, toast.duration || 3000);
	};

	const removeToast = (id: string) => {
		// 1단계: exit 상태로 변경하여 애니메이션 시작
		setToasts((prev) =>
			prev.map((toast) =>
				toast.id === id ? { ...toast, isExiting: true } : toast,
			),
		);

		// 2단계: 애니메이션 완료 후 실제 제거
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 300);
	};

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
