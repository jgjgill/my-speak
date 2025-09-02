import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
	type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
	style,
	type = "default",
	className,
	...rest
}: ThemedTextProps & { className?: string }) {
	const getClassName = () => {
		switch (type) {
			case "title":
				return "text-3xl font-bold leading-8";
			case "subtitle":
				return "text-xl font-bold";
			case "defaultSemiBold":
				return "text-base leading-6 font-semibold";
			case "link":
				return "text-base leading-8 text-primary";
			default:
				return "text-base leading-6";
		}
	};

	return (
		<Text
			className={`${getClassName()} ${className || ""}`}
			style={style}
			{...rest}
		/>
	);
}
