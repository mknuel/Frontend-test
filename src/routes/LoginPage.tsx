import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { notify } from "../components/ui/Notify";
import Spinner from "../components/loaders/Spinner";

const LoginPage: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
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
			className="flex items-center justify-center min-h-screen bg-gray-100 -dark:bg-gray-900 px-4 md:px-0">
			<div className="p-8 bg-white -dark:bg-gray-800 rounded shadow-md w-full max-w-md">
				<h2
					id="login-title"
					className="text-2xl font-bold mb-6 text-center text-gray-900 -dark:text-white">
					Welcome Back!
				</h2>

				<form onSubmit={handleSubmit} aria-describedby="login-description">
					<p id="login-description" className="sr-only">
						Please enter your username and password to access your account.
					</p>

					<div className="mb-4">
						<label
							className="block text-gray-700 -dark:text-gray-300 text-sm font-bold mb-2"
							htmlFor="username">
							Username:
						</label>
						<input
							type="text"
							id="username"
							name="username"
							placeholder="Enter your username"
							autoComplete="username"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary -dark:bg-gray-700 -dark:text-white -dark:border-gray-600"
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
							className="block text-gray-700 -dark:text-gray-300 text-sm font-bold mb-2"
							htmlFor="password">
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="Enter your password"
							autoComplete="current-password"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary -dark:bg-gray-700 -dark:text-white -dark:border-gray-600"
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
							className="text-red-500 text-sm mb-4 -mt-3"
							role="alert"
							aria-live="assertive">
							{error}
						</p>
					)}

					<div className="flex items-center justify-between">
						<button
							type="submit"
							aria-label="Sign in to your account"
							className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary -dark:bg-primary -dark:hover:bg-blue-800 w-full transition-all">
							{loading ? <Spinner /> : <span>Sign In</span>}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
};

export default LoginPage;
