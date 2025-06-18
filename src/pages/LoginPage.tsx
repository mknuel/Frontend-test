// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService"; // We'll create this
import { notify } from "../components/ui/Notify";

const LoginPage: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const data = await loginUser(username, password);
			login(data.token); // Assuming the API returns a token
			notify.success({
				title: "Welcome back chief!",
				message: "Your login was successful",
			});
			navigate("/");
		} catch (err: any) {
			setError(err.message || "Login failed. Please check your credentials.");
			notify.error({
				title: "Something went wrong!",
				message: err.message || "Your login was successful",
			});
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 -dark:bg-gray-900">
			<div className="p-8 bg-white dark:bg-gray-800 rounded shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
					Login
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-gray-700 -dark:text-gray-300 text-sm font-bold mb-2"
							htmlFor="username">
							Username:
						</label>
						<input
							type="text"
							id="username"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
							htmlFor="password">
							Password:
						</label>
						<input
							type="password"
							id="password"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
					<div className="flex items-center justify-between">
						<button
							type="submit"
							className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-primary dark:hover:bg-blue-800 w-full transition-all">
							Sign In
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
