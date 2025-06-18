import React from "react";

export default function Header() {
	return (
		<header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 shadow-sm bg-white dark:bg-gray-800 sticky top-0 left-0 w-full">
			<div className="mb-4 md:mb-0">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Recommendations
				</h1>
				<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
					Showing {/* {recommendations.length} of {totalItems} */} results
				</p>
			</div>

			<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
				{/* Search Input */}
				<div className="relative flex items-center w-full md:w-64">
					<input
						type="text"
						placeholder="Search recommendations..."
						// value={searchTerm}
						// onChange={handleSearchChange}
						className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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

				{/* Filter Dropdown/Button (simplified for now) */}
				<div className="relative group">
					{" "}
					{/* Added group for dropdown positioning */}
					<button
						className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
						// onClick={() => { /* Toggle filter dropdown */ alert('Filter functionality coming soon!'); }} // Removed alert, will implement dropdown below
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707V19a1 1 0 01-1 1h-16a1 1 0 01-1-1V7.293a1 1 0 01.293-.707L3 4z"></path>
						</svg>
						Filter
					</button>
					{/* Filter Tags Dropdown Content */}
					<div className="absolute right-0 mt-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
						<p className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
							Filter by Tags:
						</p>
						{/* <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
							{Object.entries(availableTags).map(([category, tags]) => (
								<div key={category} className="w-full">
									<p className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize mb-1">
										{category.replace(/([A-Z])/g, " $1").trim()}:
									</p>
									<div className="flex flex-wrap gap-1 mb-2">
										{tags?.map((tag) => (
											<button
												key={tag}
												onClick={() => handleTagToggle(tag)}
												className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200
                            ${
															selectedTags.includes(tag)
																? "bg-blue-500 text-white border-blue-500"
																: "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
														}`}>
												{tag}
											</button>
										))}
									</div>
								</div>
							))}
						</div>
						{selectedTags.length > 0 && (
							<button
								onClick={() => {
									setSelectedTags([]);
									setPage(1);
								}}
								className="mt-4 w-full px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
								Clear Filters
							</button>
						)} */}
					</div>
				</div>
			</div>
		</header>
	);
}
