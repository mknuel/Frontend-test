// src/pages/ArchivePage.tsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getArchivedRecommendations,
	unarchiveRecommendation,
	getProviderNameFromId,
} from "../services/recommendationService";
import { Recommendation, ApiResponse } from "../types/recommendation";
import RecommendationCard from "../components/ui/RecommendationCard";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Archive, Funnel, XCircle } from "lucide-react";

interface TagWithCount {
	name: string;
	count: number;
}

// Define the expected success response from the mutation
interface ArchiveSuccessResponse {
	message: string;
	recommendation?: Recommendation;
}

const ArchivePage: React.FC = () => {
	const queryClient = useQueryClient();

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
	const [providerSearchTerm, setProviderSearchTerm] = useState<string>("");

	const {
		data: queryData,
		isLoading,
		isError,
		error,
	} = useQuery<ApiResponse, Error>({
		queryKey: [
			"archivedRecommendations",
			searchTerm,
			JSON.stringify(selectedProviders),
		],
		queryFn: () => getArchivedRecommendations(searchTerm, selectedProviders),
		staleTime: 1000 * 60,
	});

	// const totalItems: number = queryData?.pages[0]?.pagination.totalItems || 0;
	const archivedRecommendations: Recommendation[] = queryData?.data || [];
	const availableTags = queryData?.availableTags;

	const availableProvidersWithCounts: TagWithCount[] = useMemo(() => {
		const providerNamesFromTags = availableTags?.providers || [];
		if (!providerNamesFromTags.length) return [];

		const counts: { [name: string]: number } = {};

		archivedRecommendations.forEach((rec) => {
			rec.provider?.forEach((providerId) => {
				const providerName = getProviderNameFromId(providerId);
				if (providerNamesFromTags.includes(providerName)) {
					counts[providerName] = (counts[providerName] || 0) + 1;
				}
			});
		});

		const categorizedProviders: TagWithCount[] = providerNamesFromTags.map(
			(name) => ({
				name: name,
				count: counts[name] || 0,
			})
		);

		categorizedProviders.sort((a, b) => b.count - a.count);

		return categorizedProviders;
	}, [availableTags, archivedRecommendations]);

	// Corrected the useMutation hook's generic type for the return data
	const unarchiveMutation = useMutation<
		ArchiveSuccessResponse,
		Error,
		string,
		{ previousArchived?: ApiResponse }
	>({
		mutationFn: unarchiveRecommendation,
		onMutate: async (id: string) => {
			const queryKey = [
				"archivedRecommendations",
				searchTerm,
				JSON.stringify(selectedProviders),
			];
			await queryClient.cancelQueries({ queryKey });

			const previousArchived = queryClient.getQueryData<ApiResponse>(queryKey);

			queryClient.setQueryData<ApiResponse>(queryKey, (oldData) => {
				if (!oldData) return undefined;
				return {
					...oldData,
					data: oldData.data.filter((rec) => rec.recommendationId !== id),
				};
			});

			return { previousArchived };
		},
		onError: (
			err: Error,
			id: string,
			context?: { previousArchived?: ApiResponse }
		) => {
			const queryKey = [
				"archivedRecommendations",
				searchTerm,
				JSON.stringify(selectedProviders),
			];
			if (context?.previousArchived) {
				queryClient.setQueryData(queryKey, context.previousArchived);
			}
			console.error("Failed to unarchive recommendation:", err);
			alert(`Failed to unarchive recommendation: ${err.message}`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["archivedRecommendations"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
		},
	});

	const handleUnarchive = (id: string) => {
		unarchiveMutation.mutate(id);
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

	const filteredAvailableProviders = useMemo(() => {
		if (!providerSearchTerm) {
			return availableProvidersWithCounts;
		}
		const lowerCaseSearchTerm = providerSearchTerm.toLowerCase();
		return availableProvidersWithCounts.filter((provider) =>
			provider.name.toLowerCase().includes(lowerCaseSearchTerm)
		);
	}, [availableProvidersWithCounts, providerSearchTerm]);

	return (
		<DashboardLayout>
			<header className="sticky top-0 left-0 flex flex-col gap-4 justify-between items-start p-6 bg-[#f3f4f6] z-10 w-full">
				<div className="w-full flex justify-between items-center">
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold text-black">
							Recommendations Archived
						</h1>
						<Archive />
					</div>
					{/* <Link
						to="/"
						className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200">
						Back to Dashboard
					</Link> */}
				</div>

				<div className="flex flex-col md:flex-row items-center gap-4 w-full">
					<div className="flex gap-4 w-full">
						<div className="relative flex items-center w-full md:w-80">
							<input
								type="text"
								placeholder="Search"
								value={searchTerm}
								onChange={handleSearchChange}
								className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary w-full"
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

						<div className="relative group">
							<button className="px-2 py-2 rounded-lg text-gray-900 flex items-center gap-2 border border-gray-300 hover:bg-gray-100 -ml-2 transition-colors">
								<Funnel size={16} />
								Filter
							</button>
							<div className="absolute right-0 mt-2 w-72 p-0 bg-white rounded-lg border border-gray-50 shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
								<div className="relative flex items-center p-3 border-b border-gray-200">
									<input
										type="text"
										placeholder="Cloud Provider"
										value={providerSearchTerm}
										onChange={(e) => setProviderSearchTerm(e.target.value)}
										className="pl-9 pr-4 py-3 rounded-t-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm"
									/>
									<svg
										className="absolute left-3 w-4 h-4 text-gray-400 dark:text-gray-300"
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
											className="absolute right-3 text-gray-500 hover:text-gray-700"
											aria-label="Clear provider search">
											<XCircle size={16} />
										</button>
									)}
								</div>

								<div className="flex flex-col gap-1 max-h-60 overflow-y-auto px-3 py-2">
									{filteredAvailableProviders.length === 0 &&
									providerSearchTerm ? (
										<p className="text-gray-500 text-sm text-center py-4">
											No matching providers found.
										</p>
									) : (
										filteredAvailableProviders.map((tag: TagWithCount) => (
											<label
												key={tag.name}
												className="flex items-center justify-between cursor-pointer text-gray-800 hover:bg-gray-100 p-1 rounded transition-colors">
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														checked={selectedProviders.includes(tag.name)}
														onChange={() => handleProviderToggle(tag.name)}
														className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 transition-colors"
													/>
													<span className="text-sm capitalize">{tag.name}</span>
												</div>
												<span className="text-xs text-gray-500">
													({tag.count})
												</span>
											</label>
										))
									)}
								</div>

								{selectedProviders.length > 0 && (
									<button
										onClick={() => {
											setSelectedProviders([]);
											setProviderSearchTerm("");
										}}
										className="mt-2 w-full px-4 py-2 text-sm text-black border-t border-gray-200 transition-colors font-semibold rounded-b-lg">
										Clear Filters
									</button>
								)}
							</div>
						</div>
					</div>
					<p className="text-sm text-gray-700 whitespace-nowrap">
						Showing {archivedRecommendations.length} of {/* {totalItems} */}{" "}
						results
					</p>
				</div>
			</header>

			<main className="p-6 overflow-y-auto">
				{isLoading && (
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
						<span className="ml-3 text-lg text-gray-700">
							Loading archived items...
						</span>
					</div>
				)}
				{isError && (
					<div className="text-center py-4 text-red-500">
						Error: {error?.message}
					</div>
				)}

				{!isLoading && archivedRecommendations.length === 0 && !isError && (
					<div className="text-center py-10 text-gray-500">
						No archived recommendations found.
					</div>
				)}
				<div className="grid grid-cols-1  gap-6">
					{archivedRecommendations.map((rec) => (
						<RecommendationCard
							key={rec.recommendationId}
							recommendation={rec}
							onArchiveUnarchive={handleUnarchive}
							isArchived={true}
						/>
					))}
				</div>
			</main>
		</DashboardLayout>
	);
};

export default ArchivePage;
