"use client";

export default function UnsupportedAudioRecorder() {
	return (
		<div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
			<h4 className="font-semibold mb-3">🎤 음성 녹음하기</h4>
			<p className="text-sm mb-4">위 스크립트를 소리내어 읽어보세요.</p>

			<div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
				<p className="text-yellow-800 text-sm">
					현재 환경에서는 녹음 기능이 지원되지 않습니다. Chrome, Firefox,
					Safari 등 최신 브라우저에서 사용해주세요.
				</p>
			</div>
		</div>
	);
}