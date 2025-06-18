// src/App.tsx
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ArchivePage from "./pages/ArchivePage";
import NotFoundPage from "./pages/NotFound";
import "./index.css";

// Import QueryClient and QueryClientProvider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Optional: for dev tools
import { Bounce, ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			refetchOnReconnect: true,
			retry: 3,
		},
	},
});

// A simple PrivateRoute component (no changes here)
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		// You might want a more sophisticated loading spinner here
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
				<p className="text-xl">Loading authentication...</p>
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
	return (
		<Router>
			{/* Wrap with QueryClientProvider */}
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<AuthProvider>
						<ToastContainer
							position="top-right"
							autoClose={5000}
							hideProgressBar
							newestOnTop={false}
							closeOnClick={false}
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme="light"
							className={"toastify__toast"}
							transition={Bounce}
						/>
						<Routes>
							<Route path="/login" element={<LoginPage />} />
							<Route
								path="/"
								element={
									<PrivateRoute>
										<Dashboard />
									</PrivateRoute>
								}
							/>
							<Route
								path="/archive"
								element={
									<PrivateRoute>
										<ArchivePage />
									</PrivateRoute>
								}
							/>
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</AuthProvider>
				</ThemeProvider>
				{/* Optional: React Query Devtools for easier debugging */}
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</Router>
	);
}

export default App;
