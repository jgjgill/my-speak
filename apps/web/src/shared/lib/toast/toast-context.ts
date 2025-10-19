import { createSafeContext } from "../create-safe-context";

export interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info";
	duration?: number;
	isExiting?: boolean;
}

export interface ToastContextType {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
}

export const [ToastProvider, useToast] =
	createSafeContext<ToastContextType>("Toast");
