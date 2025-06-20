import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (token: string) => void;
	logout: () => void;
}

interface JwtPayload {
	exp?: number; // Expiry is optional
	// You can define additional fields based on your token structure
	// e.g., email?: string, userId?: string, etc.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (token) {
			try {
				const decoded: JwtPayload = jwtDecode(token);

				console.log(decoded);
				const now = Date.now() / 1000; // in seconds

				if (decoded.exp && decoded.exp < now) {
					// Token expired
					localStorage.removeItem("authToken");
					setIsAuthenticated(false);
				} else {
					setIsAuthenticated(true);
				}
			} catch (error) {
				// Invalid token
				console.error("Invalid token:", error);
				localStorage.removeItem("authToken");
				setIsAuthenticated(false);
			}
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
