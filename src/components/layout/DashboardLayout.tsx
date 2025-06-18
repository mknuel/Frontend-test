// src/components/layout/DashboardLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "./DashboardSidebar";
import { FilterProvider } from "../../context/FilterContext";

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
				<Sidebar />

				{/* Main Content Area */}
				<div className="flex flex-col w-full">
					<Outlet />
				</div>
			</div>
		</FilterProvider>
	);
};


export default DashboardLayout;
