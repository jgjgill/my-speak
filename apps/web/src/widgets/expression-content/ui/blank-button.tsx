"use client";

import { useEffect, useRef, useState } from "react";

interface BlankButtonProps {
	text: string;
	hidden: boolean;
	onToggle: () => void;
}

export function BlankButton({ text, hidden, onToggle }: BlankButtonProps) {
	const [fixedWidth, setFixedWidth] = useState(0);
	const ref = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (ref.current && fixedWidth === 0) {
			setFixedWidth(ref.current.getBoundingClientRect().width);
		}
	}, [fixedWidth]);

	return (
		<button
			ref={ref}
			type="button"
			onClick={onToggle}
			className={`inline-block rounded px-2 py-0.5 cursor-pointer transition-opacity hover:opacity-80 ${
				hidden
					? "bg-gray-100 border border-dashed border-gray-400"
					: "bg-blue-100 border border-solid border-blue-500 text-blue-800"
			}`}
			style={fixedWidth > 0 ? { width: fixedWidth } : undefined}
		>
			{hidden ? "\u00A0" : text}
		</button>
	);
}
