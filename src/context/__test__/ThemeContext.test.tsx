import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../ThemeContext";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<div>
			<p data-testid="theme-value">{theme}</p>
			<button onClick={toggleTheme}>Toggle Theme</button>
		</div>
	);
};

beforeEach(() => {
	localStorage.clear();
	document.documentElement.className = "";
	document.documentElement.removeAttribute("data-theme");
	jest.clearAllMocks();
});

describe("ThemeContext", () => {
	it("defaults to light theme if none saved", () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId("theme-value").textContent).toBe("light");
		expect(localStorage.getItem("theme")).toBe("light");
		expect(document.documentElement.classList.contains("light")).toBe(true);
		expect(document.documentElement.getAttribute("data-theme")).toBe("light");
	});

	it("respects saved theme from localStorage", () => {
		localStorage.setItem("theme", "dark");

		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId("theme-value").textContent).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
	});

	it("toggles from light to dark and updates DOM + localStorage", async () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId("theme-value").textContent).toBe("light");

		await userEvent.click(screen.getByText("Toggle Theme"));

		expect(screen.getByTestId("theme-value").textContent).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
	});

	it("throws error if useTheme is used outside provider", () => {
		const BrokenComponent = () => {
			useTheme();
			return null;
		};

		expect(() => render(<BrokenComponent />)).toThrow(
			"useTheme must be used within a ThemeProvider"
		);
	});
});
