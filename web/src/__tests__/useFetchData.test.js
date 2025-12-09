import { renderHook, waitFor } from "@testing-library/react";
import useFetchData from "../hooks/useFetchData";
import axios from "axios";

jest.mock("axios");

describe("useFetchData Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial loading state", () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useFetchData("/api/test"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("fetches data successfully", async () => {
    const mockData = [{ id: 1, name: "Test" }];
    axios.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFetchData("/api/test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });
  });

  it("handles errors", async () => {
    const mockError = new Error("Network error");
    axios.get.mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetchData("/api/test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBe(null);
    });
  });

  it("calls refetch function", async () => {
    const mockData = [{ id: 1, name: "Test" }];
    axios.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFetchData("/api/test"));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);

    // Reset mock and call refetch
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockData });

    result.current.refetch();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/test");
    });
  });

  it("re-fetches when URL changes", async () => {
    const mockData1 = [{ id: 1, name: "Test 1" }];
    const mockData2 = [{ id: 2, name: "Test 2" }];

    axios.get.mockResolvedValueOnce({ data: mockData1 });
    const { result, rerender } = renderHook(({ url }) => useFetchData(url), {
      initialProps: { url: "/api/test1" },
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    axios.get.mockResolvedValueOnce({ data: mockData2 });
    rerender({ url: "/api/test2" });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });
  });
});
