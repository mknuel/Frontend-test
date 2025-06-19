import React from "react";

const RecommendationLoader: React.FC = () => {
	return (
		<div className="bg-white -dark:bg-gray-800 shadow-lg rounded-xl flex flex-col w-full relative animate-pulse my-5">
			<div className="flex flex-col-reverse md:flex-row h-full">
				{/* Icon Box */}
				<div className="bg-gray-200 -dark:bg-gray-700 h-fill lg:aspect-square w-full md:w-20 lg:w-36 lg:min-w-36 grid place-items-center">
					<div className="w-8 h-8 bg-gray-300 rounded" />
				</div>

				{/* Content */}
				<div className="flex p-3  gap-3 w-full">
					{/* Left section */}
					<div className="w-full md:w-3/4 space-y-3">
						{/* Title */}
						<div className="flex items-center justify-between">
							<div className="h-5 w-3/4 bg-gray-300 rounded" />
							<div className="flex gap-2 pr-5">
								<div className="w-6 h-6 bg-gray-300 rounded-full" />
								<div className="w-6 h-6 bg-gray-300 rounded-full" />
							</div>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<div className="h-3 w-full bg-gray-200 rounded" />
							<div className="h-3 w-5/6 bg-gray-200 rounded" />
							<div className="h-3 w-3/4 bg-gray-200 rounded" />
						</div>

						{/* Framework Tags */}
						<div className="flex gap-2 flex-wrap">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-4 w-20 bg-gray-200 rounded" />
							))}
						</div>
					</div>

					{/* Right section */}
					<div className="w-full md:w-1/4 min-w-1/4 grid ml-auto">
						<div className="mt-auto p-4 pb-0 bg-gray-100 -dark:bg-gray-700 h-full rounded-md space-y-3">
							<div className="text-center space-y-1">
								<div className="h-4 w-24 mx-auto bg-gray-300 rounded" />
								<div className="h-3 w-32 mx-auto bg-gray-200 rounded" />
							</div>

							<div className="flex justify-center gap-2 pt-2">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="w-2.5 h-2.5 bg-gray-300 rounded-sm" />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecommendationLoader;
