import React from "react";
import { render, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext"; // adjust path as needed
import { jwtDecode } from "jwt-decode";

// Mock jwt-decode
jest.mock("jwt-decode", () => ({
	jwtDecode: jest.fn(),
}));

const mockJwtDecode = jwtDecode as jest.Mock;

// Helper test component to consume context
const TestComponent = () => {
	const { isAuthenticated, isLoading, login, logout } = useAuth();

	return (
		<div>
			<p>isAuthenticated: {isAuthenticated.toString()}</p>
			<p>isLoading: {isLoading.toString()}</p>
			<button onClick={() => login("valid.token")}>Login</button>
			<button onClick={logout}>Logout</button>
		</div>
	);
};

describe("AuthContext with jwt-decode", () => {
	beforeEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
	});

	it("should start unauthenticated with no token", async () => {
		const { getByText } = render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		await waitFor(() => {
			expect(getByText(/isAuthenticated: false/i)).toBeInTheDocument();
			expect(getByText(/isLoading: false/i)).toBeInTheDocument();
		});
	});

	it("should authenticate if token is valid", async () => {
		const fakeToken = "valid.token";
		localStorage.setItem("authToken", fakeToken);
		mockJwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 60 });

		const { getByText } = render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		await waitFor(() => {
			expect(getByText(/isAuthenticated: true/i)).toBeInTheDocument();
			expect(getByText(/isLoading: false/i)).toBeInTheDocument();
		});
	});

	it("should logout if token is expired", async () => {
		const expiredToken = "expired.token";
		localStorage.setItem("authToken", expiredToken);
		mockJwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 60 });

		const { getByText } = render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		await waitFor(() => {
			expect(getByText(/isAuthenticated: false/i)).toBeInTheDocument();
			expect(getByText(/isLoading: false/i)).toBeInTheDocument();
		});
	});

	it("should logout if token is invalid", async () => {
		const invalidToken = "invalid.token";
		localStorage.setItem("authToken", invalidToken);
		mockJwtDecode.mockImplementation(() => {
			throw new Error("Invalid token");
		});

		const { getByText } = render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		await waitFor(() => {
			expect(getByText(/isAuthenticated: false/i)).toBeInTheDocument();
			expect(getByText(/isLoading: false/i)).toBeInTheDocument();
		});
	});
});
