// src/components/ui/RecommendationCard.tsx
import React, { JSX } from "react";
import { Recommendation } from "../../types/recommendation";
import { /* Archive, */ Box } from "lucide-react";
import { ReactComponent as AWSIcon } from "../../assets/icons/aws.svg";
import { ReactComponent as AzureIcon } from "../../assets/icons/azure.svg";
import { ReactComponent as GcpIcon } from "../../assets/icons/gcp.svg";

interface RecommendationCardProps {
	recommendation: Recommendation;
	onClick?: () => void;
	onArchiveAction?: (id: string, isArchiving: boolean) => void;
	isArchived?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
	recommendation,
	onClick,
	// onArchiveAction,
	isArchived = false,
}) => {
	/* const handleArchiveClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent card click from opening detail panel
		if (onArchiveAction) {
			onArchiveAction(recommendation.id, !isArchived);
		}
	}; */

	const providerIcons: { [key: string]: JSX.Element } = {
		"provider-0": <></>, // Unspecified
		"provider-1": <AWSIcon className="w-5 h-5" />, // AWS
		"provider-2": <AzureIcon className="w-5 h-5" />, // Azure
		"provider-3": <GcpIcon className="w-5 h-5" />, // GCP
	};

	return (
		<div
			className={`bg-white dark:bg-gray-800- shadow-lg rounded-xl flex flex-col cursor-pointer w-full relative
				 animate-fade-in
        hover:shadow-xl transition-all duration-300 overflow-hidden
        `}
			onClick={onClick}>
			{/* <button
				onClick={handleArchiveClick}
				className="w-fit font-medium py-2 px-2 rounded-lg transition-colors duration-200 text-sm flex gap-2 items-center absolute top-2 left-2 border bg-white/20 ">
				<Archive size={14} color="white" />
			</button> */}

			<div className="flex flex-col-reverse md:flex-row h-full">
				<div
					className={`bg-primary h-fill lg:aspect-square w-full md:w-20 lg:w-36 lg:min-w-36 grid place-items-center ${
						isArchived ? "opacity-70 grayscale" : ""
					}`}>
					<Box color="#fff" strokeWidth={3} size={32} />
				</div>

				<div className="flex p-3 w-auto flex-wrap gap-3 md:gap-0">
					<div className="w-full md:w-3/4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="md:text-lg font-bold text-black dark:text-white- flex-1 mr-4">
								{recommendation.title}
							</h3>

							<div className="pr-5">
								{recommendation?.provider?.map(
									(providerId) => providerIcons?.[`${"provider-" + providerId}`]
								)}
							</div>
						</div>

						<p className="text-gray-800 font-medium  text-sm mb-4 line-clamp-3">
							{recommendation.description}
						</p>

						<div className="flex flex-wrap gap-2 mb-0">
							{recommendation.frameworks &&
								recommendation.frameworks.map((framework, idx) => (
									<span
										key={`${framework}-${idx}`}
										className="px-2 py-.5 bg-[#f3f4f6] rounded text-xs font-medium">
										{framework?.name}
									</span>
								))}
						</div>
					</div>
					<div className="w-full md:w-1/4 min-w-1/4 grid">
						<div className="mt-auto p-4 pb-0 bg-[#f3f4f6] h-full rounded-md">
							<div className=" items-center text-center justify-between mb-2">
								<span className="text-sm text-black font-semibold leading-none">
									Impact Assessment
								</span>
								<br />
								<span className="text-sm leading-none">
									~{recommendation.impactAssessment?.totalViolations || 0}{" "}
									Violations / month
								</span>
							</div>

							<div className="flex justify-center gap-3 items-center text-sm text-gray-900 border-t border-gray-200 mt-2 py-3">
								<span className="inline-block font-semibold whitespace-nowrap">
									Value Score:
								</span>

								<div className="flex gap-0.5">
									{[0, 1, 2, 3].map((i) => {
										const value =
											recommendation.impactAssessment?.totalViolations || 0;
										const fillLevel = Math.min(
											Math.floor((value / 100) * 4),
											4
										); // each box represents 25%
										const isFilled = i < fillLevel;

										return (
											<div
												key={i}
												className={`w-2.5 h-2.5 rounded-sm ${
													isFilled ? "bg-[#16d1ee]" : "bg-gray-200"
												}`}
											/>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecommendationCard;
