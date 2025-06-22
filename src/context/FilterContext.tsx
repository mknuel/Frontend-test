// src/contexts/FilterContext.tsx
import React, {
	createContext,
	useState,
	useContext,
	useMemo,
	useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
	getAllRecommendationsForCounting,
	getProviderNameFromId,
} from "../services/recommendationService";
import { Recommendation } from "../types/recommendation";
import { useLocation } from "react-router";

interface AvailableFilters {
	providers: string[];
	frameworks: string[];
	riskClasses: string[];
	reasons: string[];
}

interface CombinedFilterData {
	availableFilters: AvailableFilters;
	tagCounts: Record<string, number>;
}

export interface FilterContextState {
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
	availableFilters: AvailableFilters;
	isFilterLoading: boolean;
}

const FilterContext = createContext<FilterContextState | undefined>(undefined);

const toggleItem = (list: string[], item: string): string[] =>
	list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const location = useLocation();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterSearchTerm, setFilterSearchTerm] = useState("");
	const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
	const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
	const [selectedRiskClasses, setSelectedRiskClasses] = useState<string[]>([]);
	const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

	// Combined query for availableFilters + tagCounts
	const { data, isLoading: isFilterLoading } = useQuery<
		CombinedFilterData,
		Error
	>({
		queryKey: ["filterMeta", searchTerm],
		queryFn: async () => {
			const allRecs = await getAllRecommendationsForCounting(searchTerm);

			const providers = new Set<string>();
			const frameworks = new Set<string>();
			const riskClasses = new Set<string>();
			const reasons = new Set<string>();
			const tagCounts: Record<string, number> = {};

			allRecs.forEach((rec: Recommendation) => {
				rec.provider.forEach((providerId) => {
					const name = getProviderNameFromId(providerId);
					providers.add(name);
					tagCounts[name] = (tagCounts[name] || 0) + 1;
				});
				rec.frameworks?.forEach((fw) => {
					frameworks.add(fw.name);
					tagCounts[fw.name] = (tagCounts[fw.name] || 0) + 1;
				});
				if (rec.class) {
					const cls = `${rec.class}`;
					riskClasses.add(cls);
					tagCounts[cls] = (tagCounts[cls] || 0) + 1;
				}
				rec.reasons?.forEach((r) => {
					reasons.add(r);
					tagCounts[r] = (tagCounts[r] || 0) + 1;
				});
			});

			return {
				availableFilters: {
					providers: Array.from(providers),
					frameworks: Array.from(frameworks),
					riskClasses: Array.from(riskClasses),
					reasons: Array.from(reasons),
				},
				tagCounts,
			};
		},
		staleTime: 1000 * 60 * 60 * 24, // 24h
	});

	const availableFilters = data?.availableFilters ?? {
		providers: [],
		frameworks: [],
		riskClasses: [],
		reasons: [],
	};

	const tagCounts = data?.tagCounts ?? {};
	const isCountLoading = isFilterLoading;

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

	const value: FilterContextState = {
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
		availableFilters,
		isFilterLoading,
	};

	useEffect(() => {
		clearAllFilters();
	}, [location.pathname]);

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
