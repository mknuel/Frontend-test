import { ApiResponse, Recommendation } from "./../types/recommendation";

const API_BASE_URL = "http://localhost:3001";
// 
interface ArchiveSuccessResponse {
	message: string;
	recommendation?: Recommendation;
}

// This helper function is useful for displaying provider names in the UI.
export const getProviderNameFromId = (id: number): string => {
	switch (id) {
		case 1:
			return "AWS";
		case 2:
			return "AZURE";
		case 0:
			return "UNSPECIFIED";
		default:
			return "Unknown Provider";
	}
};

// Function for fetching filter 
export const getAllRecommendationsForCounting = async (
	searchTerm: string = ""
): Promise<Recommendation[]> => {
	const url = new URL(`${API_BASE_URL}/recommendations`);
	// Use a very high limit to simulate fetching all items for accurate counts.
	url.searchParams.append("limit", "10000");
	if (searchTerm) {
		url.searchParams.append("search", searchTerm);
	}
	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error("Failed to fetch data for counts");
	}
	const result: ApiResponse = await response.json();
	return result.data;
};

export const getRecommendations = async (
	cursor: string | null = null,
	limit: number = 10,
	searchTerm: string = "",
	selectedProviders: string[] = [],
	selectedFrameworks: string[] = [],
	selectedRiskClasses: string[] = [],
	selectedReasons: string[] = []
): Promise<ApiResponse> => {
	const url = new URL(`${API_BASE_URL}/recommendations`);
	url.searchParams.append("limit", limit.toString());

	if (cursor) {
		url.searchParams.append("cursor", cursor);
	}

	if (searchTerm) {
		url.searchParams.append("search", searchTerm);
	}

	const allTags = [
		...selectedProviders,
		...selectedFrameworks,
		...selectedRiskClasses,
		...selectedReasons,
	];

	if (allTags.length > 0) {
		url.searchParams.append("tags", allTags.join(","));
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		const errorBody = await response
			.json()
			.catch(() => ({ message: "Unknown error" }));
		throw new Error(errorBody.message || "Failed to fetch recommendations");
	}
	return response.json();
};

// FIX: This function is now also updated to use cursor-based pagination.
export const getArchivedRecommendations = async (
	cursor: string | null = null, // Changed from page: number
	limit: number = 10,
	searchTerm: string = "",
	selectedProviders: string[] = [],
	selectedFrameworks: string[] = [],
	selectedRiskClasses: string[] = [],
	selectedReasons: string[] = []
): Promise<ApiResponse> => {
	const url = new URL(`${API_BASE_URL}/recommendations/archive`);
	url.searchParams.append("limit", limit.toString());

	// Send the cursor to the API if it exists.
	if (cursor) {
		url.searchParams.append("cursor", cursor);
	}

	if (searchTerm) {
		url.searchParams.append("search", searchTerm);
	}

	const allTags = [
		...selectedProviders,
		...selectedFrameworks,
		...selectedRiskClasses,
		...selectedReasons,
	];

	if (allTags.length > 0) {
		url.searchParams.append("tags", allTags.join(","));
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		const errorBody = await response
			.json()
			.catch(() => ({ message: "Unknown error" }));
		throw new Error(
			errorBody.message || "Failed to fetch archived recommendations"
		);
	}
	return response.json();
};


export const archiveRecommendation = async (
	id: string
): Promise<ArchiveSuccessResponse> => {
	const response = await fetch(
		`${API_BASE_URL}/recommendations/${id}/archive`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		}
	);
	if (!response.ok) {
		const errorBody = await response
			.json()
			.catch(() => ({ message: "Unknown error" }));
		throw new Error(errorBody.message || "Failed to archive recommendation");
	}
	return response.json();
};

export const unarchiveRecommendation = async (
	id: string
): Promise<ArchiveSuccessResponse> => {
	const response = await fetch(
		`${API_BASE_URL}/recommendations/${id}/unarchive`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		}
	);
	if (!response.ok) {
		const errorBody = await response
			.json()
			.catch(() => ({ message: "Unknown error" }));
		throw new Error(errorBody.message || "Failed to unarchive recommendation");
	}
	return response.json();
};
