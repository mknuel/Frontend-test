// src/context/ThemeContext.tsx
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem("theme");
		// Default to light if no saved preference
		return savedTheme === "dark" ? "dark" : "light";
	});

	useEffect(() => {
		// Save theme preference
		localStorage.setItem("theme", theme);

		// Remove both classes first
		document.documentElement.classList.remove("light", "dark");

		// Force add the current theme class
		document.documentElement.classList.add(theme);

		// Optional: Also set a data attribute for more control
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
