const config = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		// mock imports
		"\\.(svg|jpg|jpeg|png|gif|webp|avif|ico|bmp|tiff)$":
			"<rootDir>/jest.fileMock.js",
		"^src/(.*)$": "<rootDir>/src/$1",
		"^utils$": "<rootDir>/src/utils",
		"^components/(.*)$": "<rootDir>/src/components/$1",
		"^views/(.*)$": "<rootDir>/src/views/$1",
		"^store/(.*)$": "<rootDir>/src/store/$1",
		"^assets/(.*)$": "<rootDir>/src/assets/$1",
		"^routes/(.*)$": "<rootDir>/src/routes/$1",
		"^hooks/(.*)$": "<rootDir>/src/hooks/$1",
		"^layouts/(.*)$": "<rootDir>/src/layouts/$1",
		"^utils/(.*)$": "<rootDir>/src/utils/$1",
		"^test-utils/(.*)$": "<rootDir>/src/test-utils/$1",

		// files
		"^validate$": "<rootDir>/src/validate.js",
		"^config$": "<rootDir>/src/config.js",
		"^PrivateRoute$": "<rootDir>/src/PrivateRoute.js",
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transformIgnorePatterns: [
		"node_modules/(?!(react-router|react-router-dom|@remix-run|@tanstack)/)",
	],
	globals: {
		TextEncoder: TextEncoder,
		TextDecoder: TextDecoder,
	},
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
