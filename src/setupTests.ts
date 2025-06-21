import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
	console.error = (...args) => {
		if (
			typeof args[0] === "string" &&
			args[0].includes("Warning: ReactDOM.render is deprecated")
		) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});
