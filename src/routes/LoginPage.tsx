import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { loginUser } from "../services/authService";
import { notify } from "../components/ui/Notify";
import Spinner from "../components/loaders/Spinner";
import { Sun, Moon } from "lucide-react";

const LoginPage: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!username || !password) {
			setError("Username and password are required.");
			notify.error({
				title: "Validation Error",
				message: "Please enter both username and password.",
			});
			return;
		}

		try {
			setLoading(true);
			const data = await loginUser(username, password);
			login(data.token);
			notify.success({
				title: "Welcome back chief!",
				message: "Your login was successful",
			});
			navigate("/dashboard");
		} catch (err: unknown) {
			setLoading(false);
			if (err instanceof Error) {
				setError(err.message);
				notify.error({
					title: "Something went wrong!",
					message: err.message,
				});
			} else {
				setError("Login failed. Please check your credentials.");
				notify.error({
					title: "Something went wrong!",
					message: "Login failed. Please check your credentials.",
				});
			}
		}
	};

	return (
		<main
			role="main"
			aria-labelledby="login-title"
			className="flex items-center justify-center min-h-screen bg-background-light dark:bg-gray-700 px-4 md:px-0 relative">
			{/* Theme Toggle Switch */}
			<div className="absolute top-6 right-6">
				<button
					onClick={toggleTheme}
					className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
					aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
					{theme === "light" ? (
						<Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
					) : (
						<Sun className="w-5 h-5 text-yellow-500" />
					)}
				</button>
			</div>

			<div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-600">
				<h2
					id="login-title"
					className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white font-helvetica">
					Welcome Back!
				</h2>

				<form onSubmit={handleSubmit} aria-describedby="login-description">
					<p id="login-description" className="sr-only">
						Please enter your username and password to access your account.
					</p>

					<div className="mb-4">
						<label
							className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 font-helvetica"
							htmlFor="username">
							Username:
						</label>
						<input
							type="text"
							id="username"
							name="username"
							placeholder="Enter your username"
							autoComplete="username"
							className="shadow-sm appearance-none border border-gray-200 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark placeholder-gray-400 dark:placeholder-gray-400 transition-colors"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
								setError("");
							}}
							required
							aria-required="true"
						/>
					</div>

					<div className="mb-6">
						<label
							className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 font-helvetica"
							htmlFor="password">
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Enter your password"
							autoComplete="current-password"
							className="shadow-sm appearance-none border border-gray-200 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark placeholder-gray-400 dark:placeholder-gray-400 transition-colors"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError("");
							}}
							required
							aria-required="true"
						/>
					</div>

					{error && (
						<p
							className="text-red-500 dark:text-red-400 text-sm mb-4 -mt-3"
							role="alert"
							aria-live="assertive">
							{error}
						</p>
					)}

					<div className="flex items-center justify-between">
						<button
							type="submit"
							aria-label="Sign in to your account"
							className="bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:ring-offset-gray-800 w-full transition-all duration-200 font-helvetica">
							{loading ? <Spinner /> : <span>Sign In</span>}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
};

export default LoginPage;
