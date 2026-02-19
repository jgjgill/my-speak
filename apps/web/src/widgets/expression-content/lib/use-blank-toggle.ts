import { useState } from "react";

export function useBlankToggle(allOrders: number[]) {
	const [hiddenBlanks, setHiddenBlanks] = useState<Set<number>>(new Set());

	const toggle = (sequenceOrder: number) => {
		setHiddenBlanks((prev) => {
			const next = new Set(prev);
			if (next.has(sequenceOrder)) {
				next.delete(sequenceOrder);
			} else {
				next.add(sequenceOrder);
			}
			return next;
		});
	};

	const toggleAll = () => {
		const isAllHidden = allOrders.every((order) => hiddenBlanks.has(order));
		setHiddenBlanks(isAllHidden ? new Set() : new Set(allOrders));
	};

	return { hiddenBlanks, toggle, toggleAll };
}
