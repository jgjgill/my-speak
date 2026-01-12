import { Suspense } from "react";
import { ExpressionContent } from "@/widgets/expression-content";

interface ExpressionDetailPageProps {
	params: Promise<{ language: string; slug: string }>;
}

export default async function ExpressionDetailPage({
	params,
}: ExpressionDetailPageProps) {
	const { slug } = await params;

	return (
		<div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
			<Suspense fallback={<div>Loading...</div>}>
				<ExpressionContent slug={slug} />
			</Suspense>
		</div>
	);
}
