import { useEffect } from "react";

type Handler = (event: Event | KeyboardEvent) => void;

export function useOutFocusClose<T extends HTMLElement>(
	ref: React.RefObject<T | null>,
	handler: Handler
): void {
	useEffect(() => {
		const listener = (event: Event) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			handler(event);
		};

		const escListener = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handler(event);
			}
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		document.addEventListener("keydown", escListener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
			document.removeEventListener("keydown", escListener);
		};
	}, [ref, handler]);
}
