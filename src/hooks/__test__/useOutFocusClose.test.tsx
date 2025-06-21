import { render, fireEvent } from "@testing-library/react";
import React, { useRef, useState } from "react";
import { useOutFocusClose } from "../useOutFocusClose";

describe("useOutFocusClose", () => {
	it("calls handler on outside click", () => {
		const handler = jest.fn();

		const TestComponent = () => {
			const ref = useRef<HTMLDivElement>(null as HTMLDivElement | null);
			useOutFocusClose(ref, handler);

			return (
				<div>
					<div data-testid="outside">Outside</div>
					<div ref={ref} data-testid="inside">
						Inside
					</div>
				</div>
			);
		};

		const { getByTestId } = render(<TestComponent />);
		fireEvent.mouseDown(getByTestId("outside"));

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("does NOT call handler on inside click", () => {
		const handler = jest.fn();

		const TestComponent = () => {
			const ref = useRef<HTMLDivElement>(null as HTMLDivElement | null);
			useOutFocusClose(ref, handler);

			return (
				<div ref={ref} data-testid="inside">
					Inside
				</div>
			);
		};

		const { getByTestId } = render(<TestComponent />);
		fireEvent.mouseDown(getByTestId("inside"));

		expect(handler).not.toHaveBeenCalled();
	});

	it("calls handler on Escape key press", () => {
		const handler = jest.fn();

		const TestComponent = () => {
			const ref = useRef<HTMLDivElement>(null as HTMLDivElement | null);
			useOutFocusClose(ref, handler);

			return <div ref={ref}>Content</div>;
		};

		render(<TestComponent />);
		fireEvent.keyDown(document, { key: "Escape" });

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("removes event listeners on unmount", () => {
		const handler = jest.fn();

		const TestComponent = () => {
			const ref = useRef<HTMLDivElement>(null as HTMLDivElement | null);
			useOutFocusClose(ref, handler);
			return <div ref={ref}>Component</div>;
		};

		const { unmount } = render(<TestComponent />);
		unmount();

		fireEvent.mouseDown(document);
		fireEvent.keyDown(document, { key: "Escape" });

		expect(handler).not.toHaveBeenCalled(); // no call after unmount
	});
});
