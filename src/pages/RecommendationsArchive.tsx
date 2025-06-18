import React, { useState, useRef, useCallback, useMemo } from "react";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
	InfiniteData,
} from "@tanstack/react-query";
import {
	getArchivedRecommendations,
	unarchiveRecommendation,
} from "../services/recommendationService";
import { Recommendation, ApiResponse } from "../types/recommendation";
import RecommendationCard from "../components/ui/RecommendationCard";
import { Archive, ChevronRight } from "lucide-react";
import { useFilters } from "../context/FilterContext";
import FilterDropdown from "../components/ui/FilterDropdown";
import RecommendationLoader from "../components/loaders/RecommendationLoader";
import { notify } from "../components/ui/Notify";
import DetailSidePanel from "../components/layout/DetailSidePanel";
import { Link } from "react-router-dom";

const RecommendationsArchive: React.FC = () => {
	const queryClient = useQueryClient();
	const [selectedRecommendation, setSelectedRecommendation] =
		useState<Recommendation | null>(null);

	// Get all filter state and handlers from our custom context hook
	const {
		searchTerm,
		setSearchTerm,
		selectedProviders,
		selectedFrameworks,
		selectedRiskClasses,
		selectedReasons,
	} = useFilters();

	// Use useInfiniteQuery for pagination
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
		string | null // Page param is a cursor (string or null)
	>({
		queryKey: [
			"archivedRecommendations",
			searchTerm,
			JSON.stringify(selectedProviders),
			JSON.stringify(selectedFrameworks),
			JSON.stringify(selectedRiskClasses),
			JSON.stringify(selectedReasons),
		],
		queryFn: ({ pageParam = null }) =>
			getArchivedRecommendations(
				pageParam,
				10,
				searchTerm,
				selectedProviders,
				selectedFrameworks,
				selectedRiskClasses,
				selectedReasons
			),
		getNextPageParam: (lastPage): string | undefined => {
			return lastPage.pagination.cursor.next || undefined;
		},
		initialPageParam: null,
	});

	const archivedRecommendations: Recommendation[] =
		data?.pages.flatMap((page) => page.data) || [];
	const totalItems: number = data?.pages[0]?.pagination.totalItems || 0;

	// Extract available tags for the FilterDropdown
	const availableTags = useMemo(() => {
		const tags = data?.pages[0]?.availableTags;
		return {
			providers: tags?.providers?.sort() || [],
			frameworks: tags?.frameworks?.sort() || [],
			classes: tags?.classes?.sort() || [],
			reasons: tags?.reasons?.sort() || [],
		};
	}, [data?.pages]);

	interface UnarchiveSuccessResponse {
		message: string;
		recommendation?: Recommendation;
	}
	const handleCloseDetailPanel = () => setSelectedRecommendation(null);

	const unarchiveMutation = useMutation<
		UnarchiveSuccessResponse,
		Error,
		string,
		{ previousArchived?: InfiniteData<ApiResponse> }
	>({
		mutationFn: unarchiveRecommendation,
		onMutate: async (id: string) => {
			const queryKey = [
				"archivedRecommendations",
				searchTerm,
				JSON.stringify(selectedProviders),
				JSON.stringify(selectedFrameworks),
				JSON.stringify(selectedRiskClasses),
				JSON.stringify(selectedReasons),
			];
			await queryClient.cancelQueries({ queryKey });

			const previousArchived =
				queryClient.getQueryData<InfiniteData<ApiResponse>>(queryKey);

			queryClient.setQueryData<InfiniteData<ApiResponse>>(
				queryKey,
				(oldData) => {
					if (!oldData) return { pages: [], pageParams: [] };
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							data: page.data.filter((rec) => rec.recommendationId !== id),
						})),
					};
				}
			);

			return { previousArchived };
		},
		onError: (err, id, context) => {
			const queryKey = [
				"archivedRecommendations",
				searchTerm,
				JSON.stringify(selectedProviders),
				JSON.stringify(selectedFrameworks),
				JSON.stringify(selectedRiskClasses),
				JSON.stringify(selectedReasons),
			];
			if (context?.previousArchived) {
				queryClient.setQueryData(queryKey, context.previousArchived);
			}
			notify.error({
				title: "Failed to unarchive",
				message: err.message || "",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["archivedRecommendations"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
			notify.success({ title: "Unarchived successfully" });
			handleCloseDetailPanel();
		},
	});

	const handleUnarchive = (id: string) => {
		unarchiveMutation.mutate(id);
	};

	const handleCardClick = (recommendation: Recommendation) =>
		setSelectedRecommendation(recommendation);

	// Infinite scroll observer logic
	const observer = useRef<IntersectionObserver | null>(null);
	const lastRecommendationElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading || isFetchingNextPage || !hasNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) fetchNextPage();
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	return (
		<>
			<header className="sticky top-0 left-0 flex flex-col gap-4 justify-between items-start p-6 bg-[#f3f4f6] z-10 w-full ">
				<div className="w-full flex justify-between items-center">
					<div className="absolute top-3 flex text-xs  pl-10 lg:pl-0 items-center">
						<Link className="text-gray-400" to={"/dashboard/recommendations"}>
							Recommendations
						</Link>{" "}
						<ChevronRight size={14} /> <span>Archive</span>
					</div>
					<div className="flex items-center gap-3 mt-3">
						<h1 className="text-2xl font-bold text-black pl-10 lg:pl-0">
							Recommendations Archive
						</h1>
						<Archive />
					</div>
				</div>

				<div className="flex flex-col md:flex-row items-center gap-4 w-full">
					<div className="flex gap-4 w-full items-center">
						<div className="relative flex items-center w-full md:w-80">
							<input
								type="text"
								placeholder="Search archived items..."
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
						Showing {archivedRecommendations.length} of {totalItems} results
					</p>
				</div>
			</header>

			<main className="p-6 overflow-y-auto w-full">
				<div className="grid grid-cols-1 gap-6">
					{isLoading &&
						!isFetchingNextPage &&
						Array.from({ length: 4 }).map((_, idx) => (
							<RecommendationLoader key={idx} />
						))}

					{isError && (
						<div className="text-center py-4 text-red-500 col-span-full">
							Error: {error?.message}
						</div>
					)}

					{!isLoading && archivedRecommendations.length === 0 && !isError && (
						<div className="text-center py-10 text-gray-500 col-span-full">
							No archived recommendations found.
						</div>
					)}

					{!isLoading &&
						archivedRecommendations.map((rec, index) => (
							<div
								ref={
									archivedRecommendations.length === index + 1
										? lastRecommendationElementRef
										: null
								}
								key={rec.recommendationId}>
								<RecommendationCard
									recommendation={rec}
									onArchiveAction={() => handleUnarchive(rec.recommendationId)}
									isArchived={true}
									onClick={() => handleCardClick(rec)}
								/>
							</div>
						))}
				</div>

				{isFetchingNextPage && (
					<div className="flex items-center justify-center py-4 mt-4">
						<RecommendationLoader />
					</div>
				)}

				{!hasNextPage && !isLoading && archivedRecommendations.length > 0 && (
					<div className="text-center py-4 text-gray-500">
						No more recommendations to load.
					</div>
				)}
			</main>

			{selectedRecommendation && (
				<DetailSidePanel
					recommendation={selectedRecommendation}
					onClose={handleCloseDetailPanel}
					onArchiveUnarchive={handleUnarchive}
					isArchived={true}
				/>
			)}
		</>
	);
};

export default RecommendationsArchive;
