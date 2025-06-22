// src/components/ui/RecommendationCard.tsx
import React, { forwardRef, JSX, useState } from "react";
import { motion } from "framer-motion";
import { Recommendation } from "../../types/recommendation";
import { /* Archive, */ Archive, Box } from "lucide-react";
import { ReactComponent as AWSIcon } from "../../assets/icons/aws.svg";
import { ReactComponent as AzureIcon } from "../../assets/icons/azure.svg";
import { ReactComponent as GcpIcon } from "../../assets/icons/gcp.svg";
import Spinner from "../loaders/Spinner";

interface RecommendationCardProps {
	recommendation: Recommendation;
	onClick?: () => void;
	onArchiveAction?: (id: string, isArchiving: boolean) => void;
	isArchived?: boolean;
}
const RecommendationCard = forwardRef<HTMLDivElement, RecommendationCardProps>(
	({ recommendation, onClick, onArchiveAction, isArchived = false }, ref) => {
		const [isLoading, setIsLoading] = useState<boolean>(false);
		const handleArchiveClick = (e: React.MouseEvent) => {
			e.stopPropagation(); // Prevent card click from opening detail panel
			if (onArchiveAction) {
				setIsLoading(true);
				onArchiveAction(recommendation.recommendationId, !isArchived);
			}
		};

		const providerIcons: { [key: string]: JSX.Element } = {
			"provider-0": <></>, // Unspecified
			"provider-1": <AWSIcon className="w-5 h-5" />, // AWS
			"provider-2": <AzureIcon className="w-5 h-5" />, // Azure
			"provider-3": <GcpIcon className="w-5 h-5" />, // GCP
		};

		// Animation variants
		const cardVariants = {
			hidden: {
				opacity: 0,
				y: 50,
			},
			visible: {
				opacity: 1,
				y: 0,

				transition: {
					duration: 0.5,
					ease: [0.25, 0.25, 0, 1] as const,
				},
			},
		};
		/* 
		const hoverVariants = {
			hover: {
				y: -8,
				scale: 1.02,
				transition: {
					duration: 0.3,
					ease: "easeOut" as const,
				},
			},
			tap: {
				scale: 0.98,
				transition: {
					duration: 0.1,
				},
			},
		}; */

		return (
			<motion.div
				ref={ref}
				variants={cardVariants}
				initial="hidden"
				animate="visible"
				whileHover="hover"
				viewport={{ once: true, amount: 0.3 }}
				className={`bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 rounded-xl flex flex-col cursor-pointer w-full relative
        hover:shadow-xl dark:hover:shadow-gray-900/50 transition-shadow duration-300 overflow-hidden
        ${isArchived ? "opacity-70" : ""}
        `}
				onClick={onClick}>
				<button
					onClick={handleArchiveClick}
					className={
						"w-fit font-medium py-2 px-2 rounded-lg transition-colors duration-200 text-sm flex gap-2 items-center absolute top-2 left-2 border bg-white/20 dark:bg-black/20 z-1"
					}>
					{isLoading ? (
						<Spinner className="!w-4 !h-4 m-0 p-0" />
					) : (
						<Archive size={14} color={isArchived ? "#fff" : "white"} />
					)}
				</button>

				<div className="flex flex-col md:flex-row h-full">
					<motion.div
						className={`bg-primary dark:bg-primary h-fill lg:aspect-square w-full md:w-20 lg:w-36 lg:min-w-36 grid place-items-center py-2 md:py-0 ${
							isArchived ? "opacity-70 grayscale" : ""
						}`}>
						<motion.div
							whileHover={{ rotate: 5, scale: 1.1 }}
							transition={{ duration: 0.2 }}>
							<Box color="#fff" strokeWidth={3} size={32} />
						</motion.div>
					</motion.div>

					<div className="flex p-3 w-auto flex-wrap gap-3 md:gap-0">
						<div className="w-full md:w-3/4">
							<div className="flex items-center justify-between mb-3">
								<motion.h3
									className="md:text-lg font-bold text-black dark:text-white flex-1 mr-4"
									initial={{ opacity: 0, x: -20 }}
									viewport={{ once: true }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2, duration: 0.4 }}>
									{recommendation.title}
								</motion.h3>

								<motion.div
									className="pr-5"
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.3, duration: 0.3 }}>
									{recommendation?.provider?.map(
										(providerId) =>
											providerIcons?.[`${"provider-" + providerId}`]
									)}
								</motion.div>
							</div>

							<motion.p
								className="text-gray-800 dark:text-gray-300 font-medium text-sm mb-4 line-clamp-3"
								initial={{ opacity: 0 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.4 }}>
								{recommendation.description}
							</motion.p>

							<motion.div
								className="flex flex-wrap gap-2 mb-0"
								initial={{ opacity: 0, y: 20 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.4 }}>
								{recommendation.frameworks &&
									recommendation.frameworks.map((framework, idx) => (
										<motion.span
											key={`${framework}-${idx}`}
											className="px-2 py-.5 bg-[#f3f4f6] dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-medium"
											viewport={{ once: true }}
											whileHover={{ scale: 1.05 }}
											transition={{ duration: 0.2 }}>
											{framework?.name}
										</motion.span>
									))}
							</motion.div>
						</div>

						<div className="w-full md:w-1/4 min-w-1/4 grid">
							<motion.div
								viewport={{ once: true }}
								className="mt-auto p-4 pb-0 bg-[#f3f4f6] dark:bg-gray-700 h-full rounded-md"
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3, duration: 0.4 }}>
								<div className="items-center text-center justify-between mb-2">
									<span className="text-sm text-black dark:text-white font-semibold leading-none">
										Impact Assessment
									</span>
									<br />
									<span className="text-sm text-gray-600 dark:text-gray-300 leading-none">
										~{recommendation.impactAssessment?.totalViolations || 0}{" "}
										Violations / month
									</span>
								</div>

								<div className="flex justify-center gap-3 items-center text-sm text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-600 mt-2 py-3">
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
												<motion.div
													key={i}
													className={`w-2.5 h-2.5 rounded-sm ${
														isFilled
															? "bg-[#16d1ee]"
															: "bg-gray-200 dark:bg-gray-500"
													}`}
													viewport={{ once: true }}
													initial={{ scale: 0, opacity: 0 }}
													whileInView={{ scale: 1, opacity: 1 }}
													transition={{
														delay: 0.6 + i * 0.1,
														duration: 0.3,
														type: "spring",
														stiffness: 500,
														damping: 30,
													}}
												/>
											);
										})}
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</motion.div>
		);
	}
);
// Optional display name for debugging
RecommendationCard.displayName = "RecommendationCard";

export default RecommendationCard;
