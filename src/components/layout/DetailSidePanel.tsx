import React, { JSX, useEffect, useRef, useState } from "react";
import { Recommendation } from "../../types/recommendation";
import {
	Archive,
	BookOpenText,
	Box,
	Boxes,
	ChartColumnIncreasing,
	ExternalLink,
	OctagonAlert,
	TriangleAlert,
} from "lucide-react";

import { ReactComponent as AWSIcon } from "../../assets/icons/aws.svg";
import { ReactComponent as AzureIcon } from "../../assets/icons/azure.svg";
import { ReactComponent as GcpIcon } from "../../assets/icons/gcp.svg";
import { useOutFocusClose } from "../../hooks/useOutFocusClose";

interface DetailSidePanelProps {
	recommendation: Recommendation;
	onClose: () => void;
	onArchiveUnarchive: (id: string, isArchiving: boolean) => void;
	isArchived?: boolean;
}

const DetailSidePanel: React.FC<DetailSidePanelProps> = ({
	recommendation,
	onClose,
	onArchiveUnarchive,
	isArchived = false,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const timeout = setTimeout(() => setIsVisible(true), 10);
		return () => clearTimeout(timeout);
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			onClose();
		}, 300);
	};

	// Keyboard compatibility and out focus close
	useOutFocusClose(ref, handleClose);

	const handleArchiveClick = () => {
		onArchiveUnarchive(recommendation.recommendationId, true);
	};

	const providerIcons: { [key: string]: JSX.Element } = {
		"provider-0": <></>,
		"provider-1": <AWSIcon className="w-5 h-5" />,
		"provider-2": <AzureIcon className="w-5 h-5" />,
		"provider-3": <GcpIcon className="w-5 h-5" />,
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="sidepanel-title"
			className="fixed inset-0 z-[999] flex justify-end">
			<div
				className={`absolute inset-0 bg-black/80 dark:bg-black/90 transition-opacity duration-300 ${
					isVisible ? "opacity-100" : "opacity-0"
				}`}
				onClick={handleClose}
			/>

			<div
				ref={ref}
				className={`relative h-full w-full md:w-96 lg:w-[48%] md:min-w-[600px] p-6 pb-0 overflow-y-auto shadow-xl z-[1000] transition-transform duration-300 ease-in-out
					bg-white dark:bg-gray-800 text-gray-900 dark:text-white
					${isVisible ? "translate-x-0" : "translate-x-full"}
				`}>
				<div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
					<div className="flex justify-between items-center">
						<div className="flex">
							<div className="h-12 w-12 bg-[#0891b2] text-white sm:grid place-items-center rounded-md mr-2 hidden">
								<Boxes size={26} />
							</div>
							<div>
								<div className="flex">
									<div className="h-12 w-12 bg-[#0891b2] text-white grid place-items-center rounded-md mr-2 sm:hidden">
										<Boxes size={26} />
									</div>
									<h2
										id="sidepanel-title"
										className="text-lg font-bold break-words pr-4 text-gray-900 dark:text-white">
										{recommendation.title}
									</h2>
								</div>
								<div className="flex gap-3 items-center text-sm text-gray-900 dark:text-gray-300 flex-wrap">
									<span className="inline-block font-semibold whitespace-nowrap">
										Value Score
									</span>
									<div className="flex gap-0.5 ">
										{[0, 1, 2, 3].map((i) => {
											const value =
												recommendation.impactAssessment?.totalViolations || 0;
											const fillLevel = Math.min(
												Math.floor((value / 100) * 4),
												4
											);
											return (
												<div
													key={i}
													className={`w-2.5 h-2.5 rounded-sm ${
														i < fillLevel
															? "bg-[#16d1ee]"
															: "bg-gray-200 dark:bg-gray-600"
													}`}
												/>
											);
										})}
									</div>
									{recommendation?.provider?.map((providerId) => (
										<div
											key={providerId}
											className="ml-4 inline-flex items-center">
											{providerIcons?.[`provider-${providerId}`]}
											<strong className="ml-1">
												{providerId === 0
													? "Unspecified"
													: providerId === 1
													? "AWS"
													: providerId === 2
													? "Azure"
													: providerId === 3
													? "GCP"
													: ""}{" "}
												Environment
											</strong>
										</div>
									))}
								</div>
							</div>
						</div>
						<button
							aria-label="Close details panel"
							onClick={handleClose}
							className="p-2 rounded-full absolute right-3 top-3 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>
					<div className="flex flex-wrap gap-2 mt-2">
						{recommendation.frameworks?.map((framework, idx) => (
							<span
								tabIndex={0}
								key={`${framework}-${idx}`}
								className="px-3 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl text-xs font-medium">
								{framework?.name}
							</span>
						))}
					</div>
				</div>

				<div className="space-y-6 pb-20">
					<p className="text-gray-800 dark:text-gray-300 text-sm">
						{recommendation.description}
					</p>

					<div>
						<div className="flex">
							<Box size={20} className="text-gray-600 dark:text-gray-400" />
							<h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1 ml-2">
								Resources enforced by policy
							</h3>
						</div>
						<div className="flex flex-wrap gap-1">
							{recommendation?.affectedResources?.map((resource, index) => (
								<span
									tabIndex={0}
									key={`resource-${index}`}
									className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium first-letter:capitalize">
									{resource.name}
								</span>
							))}
						</div>
					</div>

					<div>
						<div className="flex">
							<Box size={20} className="text-gray-600 dark:text-gray-400" />
							<h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1 ml-2">
								Reasons
							</h3>
						</div>
						<div className="flex flex-wrap gap-1">
							{recommendation?.reasons?.map((reason, index) => (
								<span
									tabIndex={0}
									key={`reason-${index}`}
									className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium whitespace-pre first-letter:capitalize">
									{reason}
								</span>
							))}
						</div>
					</div>

					<div>
						<div className="flex ">
							<ChartColumnIncreasing
								size={20}
								className="text-gray-600 dark:text-gray-400"
							/>
							<h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2 ml-2">
								Impact Assessment
							</h3>
						</div>
						<div className="flex flex-wrap md:flex-nowrap min-h-24 gap-3 ">
							<div
								className="w-full md:w-1/2 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 text-sm bg-gray-50 dark:bg-gray-700 rounded-md p-3 flex flex-col justify-center px-5"
								tabIndex={0}>
								<div className="flex justify-between w-full font-medium">
									<span>Overall</span>
									<OctagonAlert
										size={14}
										className="text-gray-500 dark:text-gray-400"
									/>
								</div>
								<div className="flex justify-between text-black dark:text-white font-bold text-lg w-full">
									<strong>Violations</strong>
									<span className="text-xl">
										{recommendation.impactAssessment?.totalViolations ?? "N/A"}
									</span>
								</div>
							</div>
							<div
								className="w-full md:w-1/2 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 text-sm bg-gray-50 dark:bg-gray-700 rounded-md p-3 flex flex-col justify-center px-5"
								tabIndex={0}>
								<div className="flex justify-between w-full font-medium">
									<span>Most Impacted Scope</span>
									<TriangleAlert
										size={14}
										className="text-gray-500 dark:text-gray-400"
									/>
								</div>
								<div className="flex justify-between text-black dark:text-white font-bold text-lg w-full">
									<strong className="first-letter:capitalize">
										{recommendation.impactAssessment?.mostImpactedScope?.name ??
											"N/A"}
									</strong>
									<span className="text-xl">
										{recommendation.impactAssessment?.mostImpactedScope
											?.count ?? 0}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div>
						<div className="flex">
							<BookOpenText
								size={20}
								className="text-gray-600 dark:text-gray-400"
							/>
							<h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3 ml-2">
								Further Reading
							</h3>
						</div>
						{recommendation?.furtherReading?.map((item, index) => (
							<a
								target="_blank"
								rel="noreferrer"
								href={item?.href}
								key={`read-${index}`}
								aria-label={`Further reading: ${item?.name}`}
								className="px-3 py-1  text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium whitespace-pre first-letter:capitalize transition-colors hover:opacity-80 inline-flex gap-2">
								{item?.name}

								<ExternalLink size={16} />
							</a>
						))}
					</div>
				</div>

				<div className="sticky bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex justify-end gap-3">
					<button
						aria-label={
							isArchived
								? "Unarchive this recommendation"
								: "Archive this recommendation"
						}
						onClick={handleArchiveClick}
						className="w-fit font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm flex gap-2 items-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500">
						<Archive size={14} />
						{isArchived ? <span>Unarchive</span> : <span>Archive</span>}
					</button>

					<button className="w-fit font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm flex text-white items-center bg-primary hover:opacity-90">
						Configure Policy
					</button>
				</div>
			</div>
		</div>
	);
};

export default DetailSidePanel;
