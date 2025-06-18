// src/pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
			<h1 className="text-6xl font-bold mb-4">404</h1>
			<p className="text-xl mb-8">Page Not Found</p>
			<Link
				to="/"
				className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
				Go to Dashboard
			</Link>
		</div>
	);
};

export default NotFoundPage;
