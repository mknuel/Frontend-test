// src/components/FilterDropdown.tsx
import React, { useMemo, useEffect, useState } from "react";
import { Funnel, XCircle } from "lucide-react";
import { useFilters } from "../../context/FilterContext";

const FilterDropdown: React.FC = () => {
	const {
		filterSearchTerm,
		setFilterSearchTerm,
		selectedProviders,
		toggleProvider,
		selectedFrameworks,
		toggleFramework,
		selectedRiskClasses,
		toggleRiskClass,
		selectedReasons,
		toggleReason,
		clearAllFilters,
		activeFilterCount,
		tagCounts,
		isCountLoading,
		availableFilters,
		isFilterLoading,
	} = useFilters();

	const [debouncedTerm, setDebouncedTerm] = useState(filterSearchTerm);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedTerm(filterSearchTerm);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [filterSearchTerm]);

	const getFilteredItems = (items: string[], term: string) => {
		if (!term) return items;
		const lowerCaseTerm = term.toLowerCase();
		return items.filter((item) => item.toLowerCase().includes(lowerCaseTerm));
	};

	const filteredProviders = useMemo(
		() => getFilteredItems(availableFilters.providers, debouncedTerm),
		[availableFilters.providers, debouncedTerm]
	);
	const filteredFrameworks = useMemo(
		() => getFilteredItems(availableFilters.frameworks, debouncedTerm),
		[availableFilters.frameworks, debouncedTerm]
	);
	const filteredRiskClasses = useMemo(
		() => getFilteredItems(availableFilters.riskClasses, debouncedTerm),
		[availableFilters.riskClasses, debouncedTerm]
	);
	const filteredReasons = useMemo(
		() => getFilteredItems(availableFilters.reasons, debouncedTerm),
		[availableFilters.reasons, debouncedTerm]
	);

	const totalFilteredItems =
		filteredProviders.length +
		filteredFrameworks.length +
		filteredRiskClasses.length +
		filteredReasons.length;

	const renderFilterSection = (
		title: string,
		items: string[],
		selectedItems: string[],
		toggleHandler: (item: string) => void
	) => {
		if (items.length === 0) return null;

		return (
			<div className="pt-2">
				<h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
					{title}
				</h3>
				<div className="flex flex-col gap-1 px-3 py-2">
					{items.map((item) => (
						<label
							key={item}
							className="flex items-center justify-between cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded transition-colors">
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedItems.includes(item)}
									onChange={() => toggleHandler(item)}
									className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-600 dark:border-gray-500"
								/>
								<span className="text-xs capitalize">{item}</span>
							</div>
							<span className="text-xs text-gray-500 dark:text-gray-400">
								({tagCounts[item] || 0})
							</span>
						</label>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="relative group">
			<button className="px-4 py-2 rounded text-gray-900 dark:text-gray-100 flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm -ml-2">
				<Funnel size={14} />
				Filter
				{activeFilterCount > 0 && (
					<span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
						{activeFilterCount}
					</span>
				)}
			</button>
			<div className="absolute right-0 mt-2 w-80 p-0 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col">
				<div className="relative flex items-center border-b border-gray-200 dark:border-gray-600">
					<input
						type="text"
						placeholder="Search filters..."
						value={filterSearchTerm}
						onChange={(e) => setFilterSearchTerm(e.target.value)}
						className="pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm rounded-t-lg placeholder-gray-500 dark:placeholder-gray-400"
					/>
					<svg
						className="absolute left-3 w-4 h-4 text-gray-400 dark:text-gray-500"
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
					{filterSearchTerm && (
						<button
							onClick={() => setFilterSearchTerm("")}
							className="absolute right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
							<XCircle size={16} />
						</button>
					)}
				</div>

				<div className="flex flex-col max-h-96 overflow-y-auto">
					{(isCountLoading || isFilterLoading) && (
						<div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
							Loading filters...
						</div>
					)}
					{!(isCountLoading || isFilterLoading) && (
						<>
							{renderFilterSection(
								"Cloud Providers",
								filteredProviders,
								selectedProviders,
								toggleProvider
							)}
							{renderFilterSection(
								"Frameworks",
								filteredFrameworks,
								selectedFrameworks,
								toggleFramework
							)}
							{renderFilterSection(
								"Risk Classes",
								filteredRiskClasses,
								selectedRiskClasses,
								toggleRiskClass
							)}
							{renderFilterSection(
								"Reasons",
								filteredReasons,
								selectedReasons,
								toggleReason
							)}
							{totalFilteredItems === 0 && debouncedTerm && (
								<p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
									No matching filters found.
								</p>
							)}
						</>
					)}
				</div>

				{activeFilterCount > 0 && (
					<button
						onClick={clearAllFilters}
						className="w-full px-4 py-3 text-sm text-black dark:text-gray-100 border-t border-gray-200 dark:border-gray-600 transition-colors font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg">
						Clear All Filters
					</button>
				)}
			</div>
		</div>
	);
};

export default FilterDropdown;
