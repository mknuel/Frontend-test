// src/services/recommendationService.test.ts

import {
	getProviderNameFromId,
	getRecommendations,
	getAllRecommendationsForCounting,
	getArchivedRecommendations,
	archiveRecommendation,
	unarchiveRecommendation,
} from "../recommendationService";
import { ApiResponse, Recommendation } from "../../types/recommendation";

// Define a mock for the API base URL
const API_BASE_URL = "http://localhost:3001";
// Mock the environment variable to ensure tests are consistent
process.env.REACT_APP_BASE_URL = API_BASE_URL;

// Mock the global fetch function before each test
beforeEach(() => {
	global.fetch = jest.fn();
});

// A mock recommendation that correctly implements the Recommendation interface
const mockRecommendation: Recommendation = {
	id: "unique-id-1",
	tenantId: "tenant-123",
	recommendationId: "rec-1",
	title: "Test Recommendation",
	slug: "test-recommendation",
	description: "A test description.",
	score: 85,
	provider: [1], // AWS
	class: 1, // Represents COST_SAVING, for example
	reasons: ["Unused Resource"],
	frameworks: [{ name: "CIS", section: "Logging", subsection: "1.2" }],
	severity: "Medium",
	status: "Open",
	totalHistoricalViolations: 10,
	dateCreated: new Date().toISOString(),
	lastUpdated: new Date().toISOString(),
};

// A mock API response that uses the corrected Recommendation type
const mockApiResponse: ApiResponse = {
	data: [mockRecommendation],
	pagination: {
		cursor: {
			next: "rec-2",
		},
		totalItems: 100,
	},
	availableTags: {
		providers: ["AWS", "AZURE"],
		frameworks: ["CIS", "NIST"],
		classes: ["COST_SAVING"], // Assuming the API returns strings for tags
		reasons: ["Unused Resource"],
	},
};

describe("recommendationService", () => {
	describe("getProviderNameFromId", () => {
		it('should return "AWS" for id 1', () => {
			expect(getProviderNameFromId(1)).toBe("AWS");
		});

		it('should return "AZURE" for id 2', () => {
			expect(getProviderNameFromId(2)).toBe("AZURE");
		});

		it('should return "UNSPECIFIED" for id 0', () => {
			expect(getProviderNameFromId(0)).toBe("UNSPECIFIED");
		});

		it('should return "Unknown Provider" for an unknown id', () => {
			expect(getProviderNameFromId(999)).toBe("Unknown Provider");
		});
	});

	describe("getRecommendations", () => {
		it("should fetch recommendations successfully", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockApiResponse,
			});

			const result = await getRecommendations();

			expect(fetch).toHaveBeenCalledWith(
				`${API_BASE_URL}/recommendations?limit=10`
			);
			expect(result).toEqual(mockApiResponse);
		});

		it("should include cursor, search, and tags in the request URL", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockApiResponse,
			});

			await getRecommendations(
				"cursor-123",
				20,
				"test search",
				["AWS"],
				["CIS"],
				["COST_SAVING"],
				["Unused"]
			);

			// ROBUST FIX: Build the expected URL using the same method as the function being tested.
			// This avoids issues with different space encoding (+ vs %20).
			const expectedUrl = new URL(`${API_BASE_URL}/recommendations`);
			expectedUrl.searchParams.append("limit", "20");
			expectedUrl.searchParams.append("cursor", "cursor-123");
			expectedUrl.searchParams.append("search", "test search");
			expectedUrl.searchParams.append("tags", "AWS,CIS,COST_SAVING,Unused");

			expect(fetch).toHaveBeenCalledWith(expectedUrl.toString());
		});

		it("should throw an error if the fetch call fails", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				json: async () => ({ message: "Server error" }),
			});
			// Ensure we're expecting an error to be thrown
			await expect(getRecommendations()).rejects.toThrow("Server error");
		});
	});

	describe("getAllRecommendationsForCounting", () => {
		it("should fetch with a large limit and return only the data array", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockApiResponse,
			});

			const result = await getAllRecommendationsForCounting("test");

			expect(fetch).toHaveBeenCalledWith(
				`${API_BASE_URL}/recommendations?limit=10000&search=test`
			);
			expect(result).toEqual(mockApiResponse.data);
		});

		it("should throw an error if the fetch call fails", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
			});
			await expect(getAllRecommendationsForCounting()).rejects.toThrow(
				"Failed to fetch data for counts"
			);
		});
	});

	describe("getArchivedRecommendations", () => {
		it("should fetch archived recommendations successfully", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockApiResponse,
			});

			const result = await getArchivedRecommendations();

			expect(fetch).toHaveBeenCalledWith(
				`${API_BASE_URL}/recommendations/archive?limit=10`
			);
			expect(result).toEqual(mockApiResponse);
		});

		it("should throw an error if the fetch call fails", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				json: async () => ({ message: "Server error" }),
			});
			await expect(getArchivedRecommendations()).rejects.toThrow(
				"Server error"
			);
		});
	});

	describe("archiveRecommendation", () => {
		it("should send a POST request to archive a recommendation", async () => {
			const mockSuccessResponse = { message: "Archived successfully" };
			(fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockSuccessResponse,
			});

			const result = await archiveRecommendation("rec-1");

			expect(fetch).toHaveBeenCalledWith(
				`${API_BASE_URL}/recommendations/rec-1/archive`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer null", // localStorage is null in jest env
					},
				}
			);
			expect(result).toEqual(mockSuccessResponse);
		});

		it("should throw an error if the fetch call fails", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				json: async () => ({ message: "Failed to archive" }),
			});
			await expect(archiveRecommendation("rec-1")).rejects.toThrow(
				"Failed to archive"
			);
		});
	});

	describe("unarchiveRecommendation", () => {
		it("should send a POST request to unarchive a recommendation", async () => {
			const mockSuccessResponse = { message: "Unarchived successfully" };
			(fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockSuccessResponse,
			});

			const result = await unarchiveRecommendation("rec-1");

			expect(fetch).toHaveBeenCalledWith(
				`${API_BASE_URL}/recommendations/rec-1/unarchive`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer null",
					},
				}
			);
			expect(result).toEqual(mockSuccessResponse);
		});

		it("should throw an error if the fetch call fails", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				json: async () => ({ message: "Failed to unarchive" }),
			});
			await expect(unarchiveRecommendation("rec-1")).rejects.toThrow(
				"Failed to unarchive"
			);
		});
	});
});
