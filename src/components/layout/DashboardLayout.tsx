// src/components/layout/DashboardLayout.tsx
import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FilterProvider } from "../../context/FilterContext";

const Sidebar = lazy(() => import("./DashboardSidebar"));
interface DashboardLayoutProps {}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
	const { theme } = useTheme();

	return (
		<FilterProvider>
			<div
				className={`flex min-h-screen w-full ${
					theme === "dark"
						? "bg-gray-900 text-gray-100"
						: "bg-background text-gray-900"
				}`}>
				{/* Sidebar */}
				<Suspense fallback={null}>
					<Sidebar />
				</Suspense>

				{/* Main Content Area */}
				<div className="flex flex-col w-full">
					<Outlet />
				</div>
			</div>
		</FilterProvider>
	);
};


export default DashboardLayout;
