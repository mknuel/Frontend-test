import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
	BadgeAlert,
	Clipboard,
	FileSearch,
	LayoutDashboard,
	Sparkles,
} from "lucide-react";

export default function Sidebar() {
	const { logout } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const location = useLocation();

	const navItems = [
		{ name: "Dashboard", path: "", icon: <LayoutDashboard size={16} /> },
		{ name: "Recommendations", path: "/", icon: <Sparkles size={16} /> },
		{ name: "Policies", path: "", icon: <Clipboard size={16} /> },
		{ name: "Events", path: "", icon: <FileSearch size={16} /> },
		{ name: "Waivers", path: "", icon: <BadgeAlert size={16} /> },
	];

	return (
		<aside
			className={`w-64 min-w-64 p-2 hidden lg:flex flex-col fixed lg:sticky h-screen left-0 top-0 border-r border-gray-200 ${
				theme === "dark" ? "bg-gray-800" : "bg-background-light"
			}`}>
			<div className="flex items-center h-16  mb-6">
				<img src="/images/logo.png" className="w-[200px] -ml-3" />
			</div>

			<p className="text-[#8b929b] font-medium text-xs mb-2">Platform</p>
			<nav className="flex-1">
				<ul className="text-sm">
					{navItems.map((item) => (
						<li key={item.name} className="mb-2">
							<Link
								to={item.path}
								className={`flex items-center py-1 px-2 rounded-md  transition-colors duration-200
        ${
					location.pathname === item.path
						? "bg-primary-light  text-primary font-semibold"
						: "hover:bg-gray-200 text-gray-900"
				}`}>
								<span className="mr-1 text-xl">{item.icon}</span>{" "}
								{/* Replace with actual icon component */}
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			{/* Footer/Settings/Logout in Sidebar */}
			<div className="pt-4 mt-auto">
				<div className="flex gap-2 items-center">
					<div className="rounded-lg bg-[#22d3ee] aspect-square w-8 min-w-8 h-8 grid place-content-center text-sm">
						YL
					</div>

					<div>
						<h4 className="font-bold leading-0 text-sm text-[#2d2d2d]">
							Yair lad
						</h4>
						<p className="font-medium text-xs leading-0 -mt-1">
							yair@gmail.com
						</p>
					</div>
				</div>

				{/* <ul>
					<li className="mb-2">
						<button
							onClick={toggleTheme}
							className="flex items-center p-3 rounded-lg  w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700">
							<span className="mr-3 text-xl">
								{theme === "light" ? "🌙" : "☀️"}
							</span>{" "}
							{/* Icon 
							Switch to {theme === "light" ? "Dark" : "Light"} Mode
						</button>
					</li>
					<li className="mb-2">
						<button
							onClick={logout}
							className="flex items-center p-3 rounded-lg  w-full text-left text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900">
							<span className="mr-3 text-xl">🚪</span>{" "}
							{/* Replace with FaSignOutAlt 
							Logout
						</button>
					</li>
				</ul> */}
			</div>
		</aside>
	);
}
