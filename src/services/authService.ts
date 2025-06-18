const API_BASE_URL = process.env.REACT_APP_BASE_URL;

interface LoginSuccessResponse {
	token: string;
}

export const loginUser = async (
	username: string,
	password: string
): Promise<LoginSuccessResponse> => {
	const response = await fetch(`${API_BASE_URL}/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	if (!response.ok) {
		let errorData: { message?: string } | undefined; // More specific type for errorData
		try {
			errorData = await response.json();
		} catch (e) {
			// If JSON parsing fails, it's not a JSON error response
			errorData = { message: `Server error (Status: ${response.status})` };
		}

		let errorMessage = "Login failed";
		if (response.status === 401 || response.status === 403) {
			errorMessage = "Invalid username or password.";
		} else if (errorData && errorData.message) {
			errorMessage = errorData.message;
		} else if (response.statusText) {
			errorMessage = response.statusText; // Fallback to status text
		}
		throw new Error(errorMessage);
	}

	return response.json();
};
