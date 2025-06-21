import { renderHook, act } from "@testing-library/react";
import useDebounce from "../useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
	it("should return initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("hello", 500));
		expect(result.current).toBe("hello");
	});

	it("should update debounced value after the delay", () => {
		let value = "hello";

		const { result, rerender } = renderHook(
			({ val }) => useDebounce(val, 300),
			{
				initialProps: { val: value },
			}
		);

		// Update the value before delay
		value = "world";
		rerender({ val: value });

		// Still returns the old value immediately
		expect(result.current).toBe("hello");

		// Fast-forward until just before delay
		act(() => {
			jest.advanceTimersByTime(299);
		});
		expect(result.current).toBe("hello");

		// Fast-forward to complete delay
		act(() => {
			jest.advanceTimersByTime(1);
		});
		expect(result.current).toBe("world");
	});

	it("should clear timeout on value change before delay", () => {
		let value = "a";

		const { result, rerender } = renderHook(
			({ val }) => useDebounce(val, 300),
			{
				initialProps: { val: value },
			}
		);

		// Change value quickly multiple times
		act(() => {
			value = "b";
			rerender({ val: value });
			jest.advanceTimersByTime(100);

			value = "c";
			rerender({ val: value });
			jest.advanceTimersByTime(100);

			value = "d";
			rerender({ val: value });
			jest.advanceTimersByTime(100);
		});

		// Should not have updated yet
		expect(result.current).toBe("a");

		// Complete the final delay
		act(() => {
			jest.advanceTimersByTime(300);
		});
		expect(result.current).toBe("d");
	});
});
