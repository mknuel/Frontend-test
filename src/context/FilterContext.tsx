// src/contexts/FilterContext.tsx
import React, { createContext, useState, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	getAllRecommendationsForCounting,
	getProviderNameFromId,
} from "../services/recommendationService";
import { Recommendation } from "../types/recommendation";

// Define the shape of the context state
interface FilterContextState {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	filterSearchTerm: string;
	setFilterSearchTerm: (term: string) => void;
	selectedProviders: string[];
	selectedFrameworks: string[];
	selectedRiskClasses: string[];
	selectedReasons: string[];
	toggleProvider: (name: string) => void;
	toggleFramework: (name: string) => void;
	toggleRiskClass: (name: string) => void;
	toggleReason: (name: string) => void;
	clearAllFilters: () => void;
	activeFilterCount: number;
	tagCounts: Record<string, number>;
	isCountLoading: boolean;
}

const FilterContext = createContext<FilterContextState | undefined>(undefined);

const toggleItem = (list: string[], item: string): string[] => {
	return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterSearchTerm, setFilterSearchTerm] = useState("");
	const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
	const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
	const [selectedRiskClasses, setSelectedRiskClasses] = useState<string[]>([]);
	const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

	// Query to fetch all data for counting, depends only on the main search term.
	const { data: tagCounts = {}, isLoading: isCountLoading } = useQuery<
		Record<string, number>,
		Error,
		Record<string, number>,
		[string, string]
	>({
		queryKey: ["tagCounts", searchTerm],
		queryFn: async () => {
			const allRecs = await getAllRecommendationsForCounting(searchTerm);
			const counts: Record<string, number> = {};

			allRecs.forEach((rec: Recommendation) => {
				// Count providers
				rec.provider.forEach((providerId) => {
					const providerName = getProviderNameFromId(providerId);
					counts[providerName] = (counts[providerName] || 0) + 1;
				});
				// Count frameworks
				rec.frameworks?.forEach((framework) => {
					counts[framework.name] = (counts[framework.name] || 0) + 1;
				});
				// Count classes
				if (rec.class) {
					counts[rec.class] = (counts[rec.class] || 0) + 1;
				}
				// Count reasons
				rec.reasons?.forEach((reason) => {
					counts[reason] = (counts[reason] || 0) + 1;
				});
			});
			return counts;
		},
	});

	const toggleProvider = (name: string) =>
		setSelectedProviders((prev) => toggleItem(prev, name));
	const toggleFramework = (name: string) =>
		setSelectedFrameworks((prev) => toggleItem(prev, name));
	const toggleRiskClass = (name: string) =>
		setSelectedRiskClasses((prev) => toggleItem(prev, name));
	const toggleReason = (name: string) =>
		setSelectedReasons((prev) => toggleItem(prev, name));

	const clearAllFilters = () => {
		setSelectedProviders([]);
		setSelectedFrameworks([]);
		setSelectedRiskClasses([]);
		setSelectedReasons([]);
		setFilterSearchTerm("");
	};

	const activeFilterCount = useMemo(() => {
		return (
			selectedProviders.length +
			selectedFrameworks.length +
			selectedRiskClasses.length +
			selectedReasons.length
		);
	}, [
		selectedProviders,
		selectedFrameworks,
		selectedRiskClasses,
		selectedReasons,
	]);

	const value = {
		searchTerm,
		setSearchTerm,
		filterSearchTerm,
		setFilterSearchTerm,
		selectedProviders,
		selectedFrameworks,
		selectedRiskClasses,
		selectedReasons,
		toggleProvider,
		toggleFramework,
		toggleRiskClass,
		toggleReason,
		clearAllFilters,
		activeFilterCount,
		tagCounts,
		isCountLoading,
	};

	return (
		<FilterContext.Provider value={value}>{children}</FilterContext.Provider>
	);
};

export const useFilters = (): FilterContextState => {
	const context = useContext(FilterContext);
	if (context === undefined) {
		throw new Error("useFilters must be used within a FilterProvider");
	}
	return context;
};
