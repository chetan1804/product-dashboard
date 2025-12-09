import { renderHook, act, waitFor } from "@testing-library/react";
import useDebounce from "../hooks/useDebounce";

describe("useDebounce Hook", () => {
  jest.useFakeTimers();

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 300));
    expect(result.current).toBe("test");
  });

  it("debounces value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 300 });
    expect(result.current).toBe("initial"); // Still initial, not debounced yet

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("cancels previous timeout on value change", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 300 } }
    );

    rerender({ value: "second", delay: 300 });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "third", delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current).toBe("third");
    });
  });

  it("respects custom delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    rerender({ value: "updated", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
