// src/components/layout/DashboardLayout.tsx
import React, { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./DashboardSidebar";
import { FilterProvider } from "../../context/FilterContext";

// Icons (you might need to install a library like 'react-icons' or use SVGs)
// For now, we'll use simple text/placeholders.
// To use actual icons, you'd do:
// npm install react-icons
// import { FaHome, FaArchive, FaCog, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

interface DashboardLayoutProps {}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
	const { theme, toggleTheme } = useTheme();

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
