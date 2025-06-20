import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { FilterProvider, useFilters } from "../FilterContext";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mocks
jest.mock("../../services/recommendationService", () => ({
	getAllRecommendationsForCounting: jest.fn(() =>
		Promise.resolve([
			{
				provider: [1],
				frameworks: [{ name: "CIS" }],
				class: "high",
				reasons: ["exposed", "public"],
			},
			{
				provider: [2],
				frameworks: [{ name: "ISO" }],
				class: "medium",
				reasons: ["outdated"],
			},
		])
	),
	getProviderNameFromId: (id: number) => {
		return (
			{
				1: "AWS",
				2: "Azure",
			}[id] || "Unknown"
		);
	},
}));

// Utility wrapper
const queryClient = new QueryClient();
const Wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		<FilterProvider>{children}</FilterProvider>
	</QueryClientProvider>
);

// Test component to consume the context
const TestComponent = () => {
	const {
		searchTerm,
		setSearchTerm,
		filterSearchTerm,
		setFilterSearchTerm,
		selectedProviders,
		toggleProvider,
		activeFilterCount,
		tagCounts,
		isCountLoading,
		clearAllFilters,
	} = useFilters();

	return (
		<div>
			<p data-testid="searchTerm">{searchTerm}</p>
			<p data-testid="filterSearchTerm">{filterSearchTerm}</p>
			<p data-testid="selectedProviders">{selectedProviders.join(",")}</p>
			<p data-testid="activeCount">{activeFilterCount}</p>
			<p data-testid="loading">{isCountLoading ? "loading" : "done"}</p>
			<p data-testid="awsCount">{tagCounts["AWS"] ?? 0}</p>

			<button onClick={() => setSearchTerm("audit")}>Set Search</button>
			<button onClick={() => setFilterSearchTerm("aws")}>
				Set Filter Term
			</button>
			<button onClick={() => toggleProvider("AWS")}>Toggle AWS</button>
			<button onClick={clearAllFilters}>Clear All</button>
		</div>
	);
};

describe("FilterContext", () => {
	it("provides default values and updates them correctly", async () => {
		render(
			<Wrapper>
				<TestComponent />
			</Wrapper>
		);

		// Set basic filters
		await userEvent.click(screen.getByText("Set Search"));
		await userEvent.click(screen.getByText("Set Filter Term"));
		await userEvent.click(screen.getByText("Toggle AWS"));

		expect(screen.getByTestId("searchTerm").textContent).toBe("audit");
		expect(screen.getByTestId("filterSearchTerm").textContent).toBe("aws");
		expect(screen.getByTestId("selectedProviders").textContent).toBe("AWS");
		expect(screen.getByTestId("activeCount").textContent).toBe("1");

		// Clear all
		await userEvent.click(screen.getByText("Clear All"));
		expect(screen.getByTestId("selectedProviders").textContent).toBe("");
		expect(screen.getByTestId("filterSearchTerm").textContent).toBe("");
		expect(screen.getByTestId("activeCount").textContent).toBe("0");
	});

	it("throws if useFilters is used outside provider", () => {
		const BadComponent = () => {
			useFilters();
			return <div>Bad</div>;
		};

		expect(() => render(<BadComponent />)).toThrow(
			"useFilters must be used within a FilterProvider"
		);
	});
});
