import { lazy } from "react";

const RecommendationsView = lazy(() => import("../views/RecommendationsView"));
const Recommendations: React.FC = () => {
	return <RecommendationsView />;
};

export default Recommendations;
