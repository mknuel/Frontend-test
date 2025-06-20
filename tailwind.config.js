/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	// IMPORTANT: Use 'class' strategy to override system preference
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "#39a7c1",
				"primary-dark": "#32b0d6",
				"primary-light": "#e7f1f4",
				background: "#f3f4f6",
				"background-light": "#f9fafb",
				"gray-900": "#191919",
			},
			fontFamily: {
				helvetica: ["Helvetica", "sans-serif"],
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(1rem)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				"fade-in": "fade-in 0.5s ease-out forwards",
			},
		},
	},
	plugins: [],
};
