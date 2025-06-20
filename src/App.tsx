import React, { lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Bounce, ToastContainer } from "react-toastify";
import "./index.css";
import Spinner from "./components/loaders/Spinner";

// Lazy-loaded components
const LoginPage = lazy(() => import("./routes/LoginPage"));
const ArchivePage = lazy(() => import("./routes/RecommendationsArchive"));
const NotFoundPage = lazy(() => import("./routes/NotFound"));
const Recommendations = lazy(() => import("./routes/Recommendations"));
const DashboardLayout = lazy(
	() => import("./components/layout/DashboardLayout")
);

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

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100 -dark:bg-gray-900 text-gray-900 -dark:text-white">
				<p className="text-xl">Loading authentication...</p>
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
	return (
		<Router>
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

						<Suspense
							fallback={
								<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
									<p className="text-xl">
										<Spinner />
									</p>
								</div>
							}>
							<Routes>
								<Route path="/" element={<Navigate to="/login" replace />} />
								<Route path="/login" element={<LoginPage />} />

								<Route
									path="/dashboard"
									element={
										<PrivateRoute>
											<DashboardLayout />
										</PrivateRoute>
									}>
									<Route
										index
										element={<Navigate to="recommendations" replace />}
									/>
									<Route path="recommendations" element={<Recommendations />} />
									<Route
										path="recommendations/archive"
										element={<ArchivePage />}
									/>
								</Route>

								<Route path="*" element={<NotFoundPage />} />
							</Routes>
						</Suspense>
					</AuthProvider>
				</ThemeProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</Router>
	);
}

export default App;
