import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
	Menu,
	X,
	BadgeAlert,
	Clipboard,
	FileSearch,
	LayoutDashboard,
	Sparkles,
	ChevronUp,
	ChevronDown,
} from "lucide-react";

export default function Sidebar() {
	const { logout } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const location = useLocation();

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const [isOpen, setIsOpen] = useState(false);

	const navItems = [
		{ name: "Dashboard", path: "/dash", icon: <LayoutDashboard size={16} /> },
		{
			name: "Recommendations",
			path: "/dashboard/recommendations",
			icon: <Sparkles size={16} />,
		},
		{ name: "Policies", path: "/policies", icon: <Clipboard size={16} /> },
		{ name: "Events", path: "/events", icon: <FileSearch size={16} /> },
		{ name: "Waivers", path: "/waivers", icon: <BadgeAlert size={16} /> },
	];

	const toggleSidebar = () => setIsOpen(!isOpen);

	const handleThemeToggle = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		console.log("Switching to:", newTheme);
		toggleTheme(); // Still calls the real toggle function
	};

	return (
		<>
			{/* Hamburger for mobile */}
			<button
				aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
				aria-expanded={isOpen}
				aria-controls="sidebar-navigation"
				onClick={toggleSidebar}
				className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md">
				{isOpen ? <X size={20} /> : <Menu size={20} />}
			</button>

			{/* Overlay when sidebar is open */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
					onClick={toggleSidebar}
				/>
			)}

			{/* Sidebar */}
			<aside
				role="complementary"
				aria-label="Sidebar navigation"
				className={`w-64 min-w-64 p-2 fixed lg:sticky top-0 left-0 h-screen border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
				${theme === "dark" ? "bg-gray-800" : "bg-background-light"}
				${isOpen ? "translate-x-0" : "-translate-x-full"} 
				lg:translate-x-0 lg:flex`}>
				<div className="flex flex-col h-full w-full">
					<div className="flex items-center h-16 mb-6">
						<img
							src="/images/logo.png"
							className="w-[200px] -ml-3"
							alt="logo"
						/>
					</div>

					<p className="text-[#8b929b] font-medium text-xs mb-2">Platform</p>
					<nav aria-label="Main menu" className="flex-1">
						<ul className="text-sm">
							{navItems.map((item) => {
								const regex = new RegExp(`^${item.path}(/|$)`);
								const isActive =
									item?.path === "" ? false : regex.test(location.pathname);

								return (
									<li key={item.name} className="mb-2">
										<Link
											to={item.path}
											className={`flex items-center py-1 px-2 rounded-md transition-colors duration-200
											${
												isActive
													? "bg-primary-light text-primary font-semibold"
													: "hover:bg-gray-200 text-gray-900"
											}`}
											onClick={() => setIsOpen(false)}>
											<span className="mr-1 text-xl">{item.icon}</span>
											{item.name}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					{/* Footer */}
					<div className="pt-4 mt-auto relative w-full">
						{/* Profile row */}
						<div
							role="button"
							tabIndex={0}
							aria-haspopup="true"
							aria-expanded={isMenuOpen}
							aria-controls="user-menu"
							className="flex gap-2 items-center cursor-pointer"
							onClick={() => setIsMenuOpen((prev) => !prev)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setIsMenuOpen((prev) => !prev);
								}
							}}>
							<div className="rounded-lg bg-[#22d3ee] w-8 h-8 grid place-content-center text-sm">
								YL
							</div>

							<div>
								<h4 className="font-bold text-sm text-[#2d2d2d]">Yair lad</h4>
								<p className="font-medium text-xs -mt-1">yair@gmail.com</p>
							</div>

							{isMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						</div>

						{/* Dropdown menu */}
						{isMenuOpen && (
							<div
								id="user-menu"
								role="menu"
								className="absolute bottom-full mb-2 left-0 w-56 bg-white -dark:bg-gray-900 shadow-md rounded-md border z-50 text-sm">
								<ul>
									<li className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 -dark:hover:bg-gray-800 cursor-pointer">
										<span>Dark Mode</span>
										<label className="inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												className="sr-only peer"
												checked={theme === "dark"}
												onChange={handleThemeToggle}
											/>
											<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary rounded-full peer -dark:bg-gray-700 peer-checked:bg-primary relative transition">
												<span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-md transform transition peer-checked:translate-x-4" />
											</div>
										</label>
									</li>
									<li
										role="menuitem"
										onClick={logout}
										className="px-4 py-2 text-red-600 hover:bg-red-100 -dark:hover:bg-red-900 cursor-pointer">
										Logout
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</aside>
		</>
	);
}
