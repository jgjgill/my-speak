export default function UnsupportedTTS() {
	return (
		<div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
			<span className="text-gray-400">🔊</span>
			<span className="text-sm text-gray-500">음성 재생 미지원</span>
		</div>
	);
}
