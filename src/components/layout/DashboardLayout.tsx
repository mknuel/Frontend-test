// src/components/layout/DashboardLayout.tsx
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Icons (you might need to install a library like 'react-icons' or use SVGs)
// For now, we'll use simple text/placeholders.
// To use actual icons, you'd do:
// npm install react-icons
// import { FaHome, FaArchive, FaCog, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

interface DashboardLayoutProps {
	children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	const { theme, toggleTheme } = useTheme();
	const { logout } = useAuth();
	const location = useLocation();

	const navItems = [
		{ name: "Platform", path: "/", icon: "🏠" }, // Replace with FaHome
		{ name: "Dashboard", path: "/", icon: "📊" }, // Replace with FaChartBar or similar
		{ name: "Recommendations", path: "/", icon: "🛡️" }, // Replace with FaShieldAlt
		{ name: "Archive", path: "/archive", icon: "📦" }, // Replace with FaArchive
	];

	return (
		<div
			className={`flex min-h-screen w-full ${
				theme === "dark"
					? "bg-gray-900 text-gray-100"
					: "bg-background text-gray-900"
			}`}>
			{/* Header */}

			{/* Sidebar */}

			{/* Main Content Area */}
			<Sidebar />
			<div className="flex flex-col w-[calc(100% - 200px)]">
				{/* Header (will be dynamic based on the page) */}

				{children}
			</div>
		</div>
	);
};

export default DashboardLayout;
