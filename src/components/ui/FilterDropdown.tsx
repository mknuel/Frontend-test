// src/components/filters/FilterDropdown.tsx
import React, { useMemo } from "react";
import { Funnel, XCircle } from "lucide-react";
import { useFilters } from "../../context/FilterContext";

interface FilterDropdownProps {
	availableProviders: string[];
	availableFrameworks: string[];
	availableRiskClasses: string[];
	availableReasons: string[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	availableProviders,
	availableFrameworks,
	availableRiskClasses,
	availableReasons,
}) => {
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
		tagCounts, // Get the counts from the context
		isCountLoading, // Get the loading state for counts
	} = useFilters();

	const getFilteredItems = (items: string[], term: string) => {
		if (!term) return items;
		const lowerCaseTerm = term.toLowerCase();
		return items.filter((item) => item.toLowerCase().includes(lowerCaseTerm));
	};

	const filteredProviders = useMemo(
		() => getFilteredItems(availableProviders, filterSearchTerm),
		[availableProviders, filterSearchTerm]
	);
	const filteredFrameworks = useMemo(
		() => getFilteredItems(availableFrameworks, filterSearchTerm),
		[availableFrameworks, filterSearchTerm]
	);
	const filteredRiskClasses = useMemo(
		() => getFilteredItems(availableRiskClasses, filterSearchTerm),
		[availableRiskClasses, filterSearchTerm]
	);
	const filteredReasons = useMemo(
		() => getFilteredItems(availableReasons, filterSearchTerm),
		[availableReasons, filterSearchTerm]
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
				<h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					{title}
				</h3>
				<div className="flex flex-col gap-1 px-3 py-2">
					{items.map((item) => (
						<label
							key={item}
							className="flex items-center justify-between cursor-pointer text-gray-800 hover:bg-gray-100 p-1 rounded transition-colors">
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedItems.includes(item)}
									onChange={() => toggleHandler(item)}
									className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
								/>
								<span className="text-xs capitalize">{item}</span>
							</div>
							{/* Display the count */}
							<span className="text-xs text-gray-500">
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
			<button className="px-4 py-2.5 rounded-lg text-gray-900 flex items-center gap-2 border border-gray-300 hover:bg-gray-100 transition-colors text-sm -ml-2">
				<Funnel size={14} />
				Filter
				{activeFilterCount > 0 && (
					<span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
						{activeFilterCount}
					</span>
				)}
			</button>
			<div className="absolute right-0 mt-2 w-80 p-0 bg-white rounded-lg border border-gray-200 shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col">
				<div className="relative flex items-center border-b border-gray-200">
					<input
						type="text"
						placeholder="Search filters..."
						value={filterSearchTerm}
						onChange={(e) => setFilterSearchTerm(e.target.value)}
						className="pl-9 pr-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm rounded-t-lg"
					/>
					<svg
						className="absolute left-3 w-4 h-4 text-gray-400"
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
							className="absolute right-3 text-gray-500 hover:text-gray-700">
							<XCircle size={16} />
						</button>
					)}
				</div>

				<div className="flex flex-col max-h-96 overflow-y-auto">
					{isCountLoading && (
						<div className="p-4 text-center text-sm text-gray-500">
							Loading counts...
						</div>
					)}
					{!isCountLoading && (
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

							{totalFilteredItems === 0 && filterSearchTerm && (
								<p className="text-gray-500 text-sm text-center py-4">
									No matching filters found.
								</p>
							)}
						</>
					)}
				</div>

				{activeFilterCount > 0 && (
					<button
						onClick={clearAllFilters}
						className="w-full px-4 py-3 text-sm text-black border-t border-gray-200 transition-colors font-semibold hover:bg-gray-100 rounded-b-lg">
						Clear All Filters
					</button>
				)}
			</div>
		</div>
	);
};

export default FilterDropdown;
