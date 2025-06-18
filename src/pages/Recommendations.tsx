// src/pages/Recommendations.tsx

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
	getRecommendations,
	archiveRecommendation,
} from "../services/recommendationService";
import { Recommendation, ApiResponse } from "../types/recommendation";
import RecommendationCard from "../components/ui/RecommendationCard";
import DetailSidePanel from "../components/layout/DetailSidePanel";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
	InfiniteData,
} from "@tanstack/react-query";
import { Archive, Sparkles } from "lucide-react";
import { notify } from "../components/ui/Notify";
import { useFilters } from "../context/FilterContext";
import FilterDropdown from "../components/ui/FilterDropdown";
import RecommendationLoader from "../components/loaders/RecommendationLoader";
import { Link } from "react-router-dom";

const Recommendations: React.FC = () => {
	const queryClient = useQueryClient();
	const [selectedRecommendation, setSelectedRecommendation] =
		useState<Recommendation | null>(null);

	const {
		searchTerm,
		setSearchTerm,
		selectedProviders,
		selectedFrameworks,
		selectedRiskClasses,
		selectedReasons,
	} = useFilters();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useInfiniteQuery<
		ApiResponse,
		Error,
		InfiniteData<ApiResponse>,
		[string, string, string, string, string, string],
		string | null
	>({
		queryKey: [
			"recommendations",
			searchTerm,
			JSON.stringify(selectedProviders),
			JSON.stringify(selectedFrameworks),
			JSON.stringify(selectedRiskClasses),
			JSON.stringify(selectedReasons),
		],
		queryFn: async ({ pageParam = null }) => {
			return getRecommendations(
				pageParam,
				10,
				searchTerm,
				selectedProviders,
				selectedFrameworks,
				selectedRiskClasses,
				selectedReasons
			);
		},
		getNextPageParam: (lastPage): string | undefined => {
			return lastPage.pagination.cursor.next || undefined;
		},
		initialPageParam: null,
	});

	const recommendations: Recommendation[] =
		data?.pages.flatMap((page) => page.data) || [];
	const totalItems: number = data?.pages[0]?.pagination.totalItems || 0;

	const availableTags = useMemo(() => {
		const tags = data?.pages[0]?.availableTags;
		return {
			providers: tags?.providers?.sort() || [],
			frameworks: tags?.frameworks?.sort() || [],
			classes: tags?.classes?.sort() || [],
			reasons: tags?.reasons?.sort() || [],
		};
	}, [data?.pages]);

	interface ArchiveMutationSuccess {
		message: string;
		recommendation?: Recommendation;
	}

	// This mutation logic avoids race conditions by invalidating queries only after the server confirms success.
	const archiveMutation = useMutation<ArchiveMutationSuccess, Error, string>({
		mutationFn: archiveRecommendation,
		onSuccess: () => {
			notify.success({ title: "Archived successfully" });
			handleCloseDetailPanel();
			// Invalidate both queries to ensure the list and the filter counts are fresh.
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
			queryClient.invalidateQueries({ queryKey: ["tagCounts"] });

			// If the archived item was selected, close the side panel.
			if (
				selectedRecommendation?.recommendationId === archiveMutation.variables
			) {
				setSelectedRecommendation(null);
			}
		},
		onError: (err) => {
			notify.error({ title: "Failed to archive", message: err.message || "" });

			console.error(err);
		},
	});

	const observer = useRef<IntersectionObserver | null>(null);
	const lastRecommendationElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading || isFetchingNextPage || !hasNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
	);

	const handleCloseDetailPanel = () => setSelectedRecommendation(null);
	const handleCardClick = (recommendation: Recommendation) =>
		setSelectedRecommendation(recommendation);
	const handleArchiveUnarchive = (id: string, isArchiving: boolean) => {
		if (isArchiving) archiveMutation.mutate(id);
	};
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setSearchTerm(e.target.value);

	return (
		<>
			<header className="sticky top-0 left-0 flex flex-col gap-4 justify-between items-start p-6 bg-[#f3f4f6] z-10 w-full">
				<div className="w-full flex justify-between items-center">
					<div className="flex items-center gap-1.5">
						<h1 className="ml-10 lg:ml-0 text-3xl font-semibold text-black">
							Recommendations
						</h1>
						<Sparkles fill="#4bc7eb" color="#4bc7eb" />
					</div>
				</div>
				<Link
					to={"/dashboard/recommendations/archive"}
					className="w-fit font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm flex gap-2 items-center  btn absolute top-3 right-3">
					<Archive size={14} />
					<span>Archive</span>
				</Link>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full">
					<div className="flex gap-4 w-full items-center">
						<div className="relative flex items-center w-full md:w-80">
							<input
								type="text"
								placeholder="Search recommendations..."
								value={searchTerm}
								onChange={handleSearchChange}
								className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary w-full"
							/>
							<svg
								className="absolute left-3 w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>

						<FilterDropdown
							availableProviders={availableTags.providers}
							availableFrameworks={availableTags.frameworks}
							availableRiskClasses={availableTags.classes}
							availableReasons={availableTags.reasons}
						/>
					</div>
					<p className="text-sm text-gray-700 whitespace-nowrap w-full md:w-fit">
						Showing{" "}
						{recommendations.length < totalItems
							? recommendations.length
							: totalItems}{" "}
						of {totalItems} results
					</p>
				</div>
			</header>

			<main className="p-6 overflow-y-auto w-full">
				<div className="grid grid-cols-1 gap-6">
					{isLoading &&
						!isFetchingNextPage &&
						Array.from({ length: 5 }).map((_, idx) => (
							<RecommendationLoader key={idx} />
						))}

					{isError && (
						<div className="text-center py-4 text-red-500 col-span-full">
							Error: {error?.message}
						</div>
					)}

					{!isLoading && recommendations.length === 0 && !isError && (
						<div className="text-center py-10 text-gray-500 col-span-full">
							No recommendations found.
						</div>
					)}

					{!isLoading &&
						recommendations.map((rec, index) => (
							<div
								ref={
									recommendations.length === index + 1
										? lastRecommendationElementRef
										: null
								}
								key={rec.recommendationId}>
								<RecommendationCard
									recommendation={rec}
									onClick={() => handleCardClick(rec)}
									onArchiveAction={handleArchiveUnarchive}
								/>
							</div>
						))}
				</div>

				{isFetchingNextPage && (
					<div className="flex items-center justify-center py-4 mt-4">
						<RecommendationLoader />
					</div>
				)}

				{!hasNextPage && !isLoading && recommendations.length > 0 && (
					<div className="text-center py-4 text-gray-500">
						No more recommendations to load.
					</div>
				)}
			</main>

			{selectedRecommendation && (
				<DetailSidePanel
					recommendation={selectedRecommendation}
					onClose={handleCloseDetailPanel}
					onArchiveUnarchive={handleArchiveUnarchive}
				/>
			)}
		</>
	);
};

export default Recommendations;
