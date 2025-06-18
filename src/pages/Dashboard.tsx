// src/pages/Dashboard.tsx
import React, { useState, useRef, useCallback, useMemo } from "react";
import {
	getRecommendations,
	archiveRecommendation,
	getProviderNameFromId, // Import the helper function
} from "../services/recommendationService";
import { Recommendation, ApiResponse } from "../types/recommendation";
import RecommendationCard from "../components/ui/RecommendationCard";
import DetailSidePanel from "../components/layout/DetailSidePanel";
import DashboardLayout from "../components/layout/DashboardLayout";

import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
	InfiniteData,
} from "@tanstack/react-query";
import { Funnel, Sparkles, XCircle } from "lucide-react";
import { notify } from "../components/ui/Notify";

// Define a type for a single available tag with its count
interface TagWithCount {
	name: string;
	count: number;
}

// Define the structure for availableTags from API, now only focusing on providers
// This interface is now primarily for the structure of availableTags in ApiResponse
// and less for internal state, as we're directly using TagWithCount[] for filtered lists.
interface CategorizedTags {
	frameworks?: string[]; // Raw strings from API response for these categories
	reasons?: string[];
	providers?: string[]; // Raw strings from API response
	classes?: string[];
}

const Dashboard: React.FC = () => {
	const queryClient = useQueryClient();

	const [selectedRecommendation, setSelectedRecommendation] =
		useState<Recommendation | null>(null);

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedProviders, setSelectedProviders] = useState<string[]>([]); // Stores provider names
	const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false); // State for dropdown visibility
	const [providerSearchTerm, setProviderSearchTerm] = useState<string>(""); // New state for searching providers within the dropdown

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
		[string, string, string], // QueryKey type (for `queryKey: ["recommendations", searchTerm, JSON.stringify(selectedProviders)]`)
		number // PageParam type
	>({
		queryKey: [
			"recommendations",
			searchTerm,
			JSON.stringify(selectedProviders),
		],
		queryFn: async ({ pageParam = 1 }) => {
			return getRecommendations(pageParam, 10, searchTerm, selectedProviders);
		},
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = allPages.length + 1;
			return lastPage.pagination.cursor.next ? nextPage : undefined;
		},
		initialPageParam: 1,
	});

	const recommendations: Recommendation[] =
		data?.pages.flatMap((page) => page.data) || [];
	const totalItems: number = data?.pages[0]?.pagination.totalItems || 0;

	// Process availableProviders from API response and calculate counts
	const availableProvidersWithCounts: TagWithCount[] = useMemo(() => {
		// Directly type as TagWithCount[]
		const uniqueProviderNames = new Set<string>();
		data?.pages.forEach((page) => {
			page.availableTags?.providers?.forEach((providerIdOrName) => {
				// Assuming providerIdOrName from API's availableTags.providers can be string (like "AWS") or number (like 1)
				// The mock server JSON shows strings like "AWS", "AZURE", "UNSPECIFIED" in `availableTags.providers`
				if (typeof providerIdOrName === "string") {
					uniqueProviderNames.add(providerIdOrName);
				} else if (typeof providerIdOrName === "number") {
					uniqueProviderNames.add(getProviderNameFromId(providerIdOrName));
				}
			});
		});

		const currentRecs = data?.pages.flatMap((p) => p.data) || [];
		const counts: { [name: string]: number } = {};

		currentRecs.forEach((rec) => {
			if (rec.provider && rec.provider.length > 0) {
				const providerName = getProviderNameFromId(rec.provider[0]);
				counts[providerName] = (counts[providerName] || 0) + 1;
			}
		});

		const categorizedProviders: TagWithCount[] = [];
		Array.from(uniqueProviderNames).forEach((name) => {
			categorizedProviders.push({
				name: name,
				count: counts[name] || 0,
			});
		});

		categorizedProviders.sort((a, b) => b.count - a.count); // Sort by count

		return categorizedProviders;
	}, [data]);

	interface ArchiveMutationSuccess {
		message: string;
		recommendation?: Recommendation;
	}

	// Archiving mutation
	const archiveMutation = useMutation<
		ArchiveMutationSuccess,
		Error,
		string,
		{ previousRecommendations?: InfiniteData<ApiResponse> }
	>({
		mutationFn: archiveRecommendation,
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ["recommendations"] });
			await queryClient.cancelQueries({
				queryKey: ["archivedRecommendations"],
			});

			// Need to get the previous data with the exact query key to perform optimistic update
			const previousRecommendations = queryClient.getQueryData<
				InfiniteData<ApiResponse>
			>(["recommendations", searchTerm, JSON.stringify(selectedProviders)]);

			queryClient.setQueryData<InfiniteData<ApiResponse>>(
				["recommendations", searchTerm, JSON.stringify(selectedProviders)],
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

			if (selectedRecommendation?.recommendationId === id) {
				setSelectedRecommendation(null);
			}

			return { previousRecommendations };
		},
		onError: (
			err: Error,
			id: string,
			context?: { previousRecommendations?: InfiniteData<ApiResponse> }
		) => {
			if (context?.previousRecommendations) {
				queryClient.setQueryData(
					["recommendations", searchTerm, JSON.stringify(selectedProviders)],
					context.previousRecommendations
				);
			}
			console.error("Failed to archive recommendation:", err);
			notify.error({
				title: "Failed to archive recommendation",
				message: err.message || "",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
			queryClient.invalidateQueries({ queryKey: ["archivedRecommendations"] });
			notify.success({
				title: "Successful",
				message: "your request was successful",
			});
		},
	});

	const observer = useRef<IntersectionObserver | null>(null);
	const lastRecommendationElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading || isFetchingNextPage) return;
			if (observer.current) observer.current.disconnect();
			if (node && hasNextPage) {
				observer.current = new IntersectionObserver((entries) => {
					if (entries[0].isIntersecting) {
						fetchNextPage();
					}
				});
				observer.current.observe(node);
			}
		},
		[isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
	);

	const handleCardClick = (recommendation: Recommendation) => {
		setSelectedRecommendation(recommendation);
	};

	const handleCloseDetailPanel = () => {
		setSelectedRecommendation(null);
	};

	const handleArchiveUnarchive = (id: string, isArchiving: boolean) => {
		if (isArchiving) {
			archiveMutation.mutate(id);
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleProviderToggle = (providerName: string) => {
		setSelectedProviders((prev) =>
			prev.includes(providerName)
				? prev.filter((name) => name !== providerName)
				: [...prev, providerName]
		);
	};

	// Filter available providers based on providerSearchTerm
	const filteredAvailableProviders = useMemo(() => {
		if (!providerSearchTerm) {
			return availableProvidersWithCounts; // Return all if no search term
		}
		const lowerCaseSearchTerm = providerSearchTerm.toLowerCase();
		return availableProvidersWithCounts.filter(
			(
				provider // Already TagWithCount[]
			) => provider.name.toLowerCase().includes(lowerCaseSearchTerm)
		);
	}, [availableProvidersWithCounts, providerSearchTerm]);

	return (
		<DashboardLayout>
			<header className="sticky top-0 left-0 flex flex-col gap-4 justify-between items-start p-6  bg-[#f3f4f6]  z-10 w-full">
				<div className="w-full flex justify-between items-center">
					<div className="flex items-center gap-1.5">
						<h1 className="text-3xl font-semibold text-black ">
							Recommendations
						</h1>
						<Sparkles fill="#4bc7eb" color="#4bc7eb" />
					</div>
				</div>

				<div className="flex flex-col md:flex-row items-center gap-4 w-full">
					<div className="flex gap-4 w-full items-center">
						{/* Main Search Input */}
						<div className="relative flex items-center w-full md:w-80">
							<input
								type="text"
								placeholder="Search"
								value={searchTerm}
								onChange={handleSearchChange}
								className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary w-full"
							/>
							<svg
								className="absolute left-3 w-5 h-5 text-gray-400 dark:text-gray-300"
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

						{/* Filter Dropdown */}
						<div className="relative group">
							<button className="px-4 py-2.5 rounded-lg text-gray-900  flex items-center gap-2 border border-gray-300  hover:bg-gray-100  transition-colors text-sm -ml-2">
								<Funnel size={14} />
								Filter
							</button>
							<div className="absolute right-0 mt-2 w-72 p-0 bg-white rounded-lg border border-gray-50 shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
								{/* Tag Search Input */}
								<div className="relative flex items-center  border-b border-gray-200 ">
									{" "}
									{/* Added padding and border */}
									<input
										type="text"
										placeholder="Cloud Provider"
										value={providerSearchTerm}
										onChange={(e) => setProviderSearchTerm(e.target.value)}
										className="pl-9 pr-4 py-3 rounded-t-lg   bg-gray-50  text-gray-900  focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm"
									/>
									<svg
										className="absolute left-3 w-4 h-4 text-gray-400 dark:text-gray-300" // Adjusted left for padding
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
									{providerSearchTerm && (
										<button
											onClick={() => setProviderSearchTerm("")}
											className="absolute right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" // Adjusted right for padding
											aria-label="Clear provider search">
											<XCircle size={16} />
										</button>
									)}
								</div>

								{/* Filterable Providers List */}
								<div className="flex flex-col gap-1 max-h-60 overflow-y-auto px-3 py-2">
									{filteredAvailableProviders.length === 0 &&
									providerSearchTerm ? (
										<p className="text-gray-500 text-sm text-center py-4">
											No matching providers found.
										</p>
									) : (
										// Directly map over filteredAvailableProviders
										filteredAvailableProviders.map((tag: TagWithCount) => (
											<label
												key={tag.name}
												className="flex items-center justify-between cursor-pointer text-gray-800 hover:bg-gray-100  p-1 rounded transition-colors">
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														checked={selectedProviders.includes(tag.name)}
														onChange={() => handleProviderToggle(tag.name)}
														className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 transition-colors"
													/>
													<span className="text-sm capitalize">{tag.name}</span>
												</div>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													({tag.count})
												</span>
											</label>
										))
									)}
								</div>

								<button
									onClick={() => {
										setSelectedProviders([]);
										setProviderSearchTerm(""); // Clear provider search term
									}}
									className="mt-2 w-full px-4 py-3 text-sm text-black  border-t border-gray-200 transition-colors font-semibold rounded-b-lg">
									Clear Filters
								</button>
							</div>
						</div>
					</div>

					<p className="text-sm text-gray-700 whitespace-nowrap dark:text-gray-400">
						Showing {recommendations.length} of {totalItems} results
					</p>
				</div>
			</header>

			<main className="p-6 overflow-y-auto">
				{isLoading && !isFetchingNextPage && (
					<div className="flex items-center justify-center py-10">
						<svg
							className="animate-spin h-8 w-8 text-blue-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span className="ml-3 text-lg text-gray-700 dark:text-gray-300">
							Loading recommendations...
						</span>
					</div>
				)}

				{isError && (
					<div className="text-center py-4 text-red-500">
						Error: {error?.message}
					</div>
				)}

				{!isLoading && recommendations.length === 0 && !isError && (
					<div className="text-center py-10 text-gray-500">
						No recommendations found for the current criteria.
					</div>
				)}

				<div className="grid grid-cols-1  gap-6">
					{recommendations.map((rec, index) => {
						const isLastElement = recommendations.length === index + 1;
						return (
							<div
								ref={isLastElement ? lastRecommendationElementRef : null}
								key={rec.recommendationId}>
								<RecommendationCard
									recommendation={rec}
									onClick={() => handleCardClick(rec)}
									onArchiveUnarchive={handleArchiveUnarchive}
								/>
							</div>
						);
					})}
				</div>

				{isFetchingNextPage && (
					<div className="flex items-center justify-center py-4">
						<svg
							className="animate-spin h-6 w-6 text-blue-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span className="ml-2 text-md text-gray-700 dark:text-gray-300">
							Loading more...
						</span>
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
		</DashboardLayout>
	);
};

export default Dashboard;
