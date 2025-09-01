import PracticeContentSkeleton from "./components/skeletons/practice-content-skeleton";
import StageNavigationSkeleton from "./components/skeletons/stage-navigation-skeleton";
import TopicHeaderSkeleton from "./components/skeletons/topic-header-skeleton";

export default function Loading() {
	return (
		<div className="p-4">
			<TopicHeaderSkeleton />
			<StageNavigationSkeleton />
			<PracticeContentSkeleton />
		</div>
	);
}
