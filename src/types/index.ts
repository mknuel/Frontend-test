/** Represents a single framework associated with a recommendation. */
export interface Framework {
	name: string;
	url: string;
}

/** Defines the possible classes/categories for a recommendation. */
export enum RecommendationClass {
	Security = "Security",
	Performance = "Performance",
	Cost = "Cost",
	Reliability = "Reliability",
	OperationalExcellence = "Operational Excellence",
}

/** Defines the possible cloud providers. */
export enum CloudProvider {
	UNSPECIFIED = 0,
	AWS = 1,
	AZURE = 2,
}

/** Represents a single recommendation item from the API. */
export interface Recommendation {
	recommendationId: string;
	title: string;
	description: string;
	provider: CloudProvider[];
	class: RecommendationClass;
	reasons: string[];
	frameworks: Framework[];
}

/** Represents the structure of available tags returned by the API. */
export interface AvailableTags {
	frameworks: string[];
	reasons: string[];
	providers: string[];
	classes: string[];
}

/** Represents the pagination information from the API. */
export interface Pagination {
	cursor: {
		next: string | null;
	};
	totalItems: number;
}

/** Represents the complete API response for a list of recommendations. */
export interface ApiResponse {
	data: Recommendation[];
	pagination: Pagination;
	availableTags?: AvailableTags;
}

/** A single tag with its name and count for display in the filter panel. */
export interface TagWithCount {
	name: string;
	count: number;
}

export interface ArchiveSuccessResponse {
	message: string;
	recommendation?: Recommendation;
}

