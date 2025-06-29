import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Keep this for TailwindCSS

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
