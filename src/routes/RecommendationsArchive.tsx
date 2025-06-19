import { lazy } from "react";

const RecommendationsArchiveView = lazy(
	() => import("../views/RecommendationsArchiveView")
);
const Recommendations: React.FC = () => {
	return <RecommendationsArchiveView />;
};

export default Recommendations;
