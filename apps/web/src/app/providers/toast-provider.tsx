"use client";

import { type PropsWithChildren, useState } from "react";
import {
	type Toast,
	ToastProvider as ToastContextProvider,
} from "@/shared/lib/toast";

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
		<ToastContextProvider value={{ toasts, addToast, removeToast }}>
			{children}
		</ToastContextProvider>
	);
}
