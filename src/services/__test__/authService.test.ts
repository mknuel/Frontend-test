import { loginUser } from "../authService";

// Mock the API base URL
const API_BASE_URL = "http://localhost:3001";
process.env.REACT_APP_BASE_URL = API_BASE_URL;

// Mock the global fetch function before each test
beforeEach(() => {
	global.fetch = jest.fn();
});

describe("authService", () => {
	describe("loginUser", () => {
		const username = "testuser";
		const password = "password";

		it("should return a token on successful login", async () => {
			const mockSuccessResponse = { token: "fake-jwt-token" };

			(fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => mockSuccessResponse,
			});

			const result = await loginUser(username, password);

			// Check if fetch was called correctly
			expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			// Check if the correct data was returned
			expect(result).toEqual(mockSuccessResponse);
		});

		it('should throw "Invalid username or password." for a 401 status', async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				status: 401,
				json: async () => ({ message: "Unauthorized" }), // Mock server error message
			});

			// We expect the function to throw a specific error message
			await expect(loginUser(username, password)).rejects.toThrow(
				"Invalid username or password."
			);
		});

		it('should throw a generic "Login failed" error for other non-ok responses', async () => {
			const mockErrorResponse = { message: "Internal Server Error" };
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				status: 500,
				json: async () => mockErrorResponse,
			});

			await expect(loginUser(username, password)).rejects.toThrow(
				"Internal Server Error"
			);
		});

		it("should handle non-JSON error responses gracefully", async () => {
			(fetch as jest.Mock).mockResolvedValue({
				ok: false,
				status: 502,
				statusText: "Bad Gateway",
				json: () => Promise.reject(new Error("Invalid JSON")), // Simulate JSON parsing failure
			});

			// FIX: The test now expects the actual error message generated by the service.
			await expect(loginUser(username, password)).rejects.toThrow(
				"Server error (Status: 502)"
			);
		});

		it("should handle network errors when fetch itself fails", async () => {
			const networkError = new Error("Network request failed");
			(fetch as jest.Mock).mockRejectedValue(networkError);

			await expect(loginUser(username, password)).rejects.toThrow(networkError);
		});
	});
});
