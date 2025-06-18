// src/context/AuthContext.tsx
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true); // To handle initial token check

	useEffect(() => {
		// Check for token in localStorage on component mount
		const token = localStorage.getItem("authToken");
		if (token) {
			// In a real app, you'd validate the token with your backend here
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, []);

	const login = (token: string) => {
		localStorage.setItem("authToken", token);
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
