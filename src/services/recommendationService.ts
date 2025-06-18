// src/services/recommendationService.ts
import { ApiResponse, Recommendation } from "./../types/recommendation";

const API_BASE_URL = "http://localhost:3001";

// Helper function for mapping provider names to IDs
const getProviderIdFromName = (name: string): number | undefined => {
	switch (name.toLowerCase()) {
		case "aws":
			return 1;
		case "azure":
			return 2;
		case "unspecified":
			return 0; // Assuming 0 for unspecified
		default:
			return undefined;
	}
};

// Helper function for mapping provider IDs to names (for UI display)
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

export const getRecommendations = async (
	page: number = 1,
	limit: number = 10,
	searchTerm: string = "",
	selectedProviders: string[] = []
): Promise<ApiResponse> => {
	let url = new URL(`${API_BASE_URL}/recommendations`);
	url.searchParams.append("_page", page.toString());
	url.searchParams.append("_limit", limit.toString());

	if (searchTerm) {
		url.searchParams.append("q", searchTerm);
	}

	selectedProviders.forEach((providerName) => {
		const providerId = getProviderIdFromName(providerName);
		if (typeof providerId === "number") {
			url.searchParams.append("tags", providerId.toString());
		}
	});

	const response = await fetch(url.toString());
	if (!response.ok) {
		const errorBody = await response
			.json()
			.catch(() => ({ message: "Unknown error" }));
		throw new Error(errorBody.message || "Failed to fetch recommendations");
	}
	return response.json();
};

// FIX: Modified getArchivedRecommendations to accept search and providers
export const getArchivedRecommendations = async (
	searchTerm: string = "",
	selectedProviders: string[] = [],
	page: number = 1,
	limit: number = 10
): Promise<ApiResponse> => {
	let url = new URL(`${API_BASE_URL}/recommendations/archive?`);
	url.searchParams.append("_page", page.toString());
	url.searchParams.append("_limit", limit.toString());

	if (searchTerm) {
		url.searchParams.append("q", searchTerm);
	}

	selectedProviders.forEach((providerName) => {
		const providerId = getProviderIdFromName(providerName);
		if (typeof providerId === "number") {
			url.searchParams.append("tags", providerId.toString());
		}
	});

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

interface ArchiveSuccessResponse {
	message: string;
	recommendation?: Recommendation;
}

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
