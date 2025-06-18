/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#39a7c1",
				"primary-light": "#e7f1f4",
				background: "#f3f4f6",
				"background-light": "#f9fafb",
				"gray-900": "#191919",
			},
			fontFamily: {
				helvetica: ["Helvetica", "sans-serif"],
			},
		},
	},
	plugins: [],
};
