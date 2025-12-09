import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Orders from "../pages/Orders";
import ordersReducer from "../redux/slices/ordersSlice";
import axios from "axios";

jest.mock("axios");

describe("Orders Page", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: ordersReducer,
      },
    });
    jest.clearAllMocks();
  });

  it("renders orders page with title", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );
    expect(
      screen.getByRole("heading", { name: /Orders/i })
    ).toBeInTheDocument();
  });

  it("loads and displays orders on mount", async () => {
    const mockOrders = [
      {
        id: 1,
        customer_name: "John Doe",
        total: 99.99,
        status: "pending",
        created_at: "2024-12-01T10:00:00Z",
      },
      {
        id: 2,
        customer_name: "Jane Smith",
        total: 249.99,
        status: "shipped",
        created_at: "2024-12-02T14:30:00Z",
      },
    ];
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("filters orders by status", async () => {
    const mockOrders = [
      {
        id: 1,
        customer_name: "John Doe",
        total: 99.99,
        status: "pending",
        created_at: "2024-12-01T10:00:00Z",
      },
      {
        id: 2,
        customer_name: "Jane Smith",
        total: 249.99,
        status: "shipped",
        created_at: "2024-12-02T14:30:00Z",
      },
    ];
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const statusSelect = screen.getByDisplayValue(/All Statuses/i);
    fireEvent.change(statusSelect, { target: { value: "pending" } });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });

  it("changes order status via dropdown", async () => {
    const mockOrders = [
      {
        id: 1,
        customer_name: "John Doe",
        total: 99.99,
        status: "pending",
        created_at: "2024-12-01T10:00:00Z",
      },
    ];
    axios.get.mockResolvedValue({ data: mockOrders });
    axios.put.mockResolvedValue({
      data: {
        id: 1,
        customer_name: "John Doe",
        total: 99.99,
        status: "shipped",
        created_at: "2024-12-01T10:00:00Z",
      },
    });

    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const statusSelect = screen.getByDisplayValue("pending");
    fireEvent.change(statusSelect, { target: { value: "shipped" } });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/api/orders/1", {
        status: "shipped",
      });
    });
  });

  it("filters by date range", async () => {
    const mockOrders = [
      {
        id: 1,
        customer_name: "John Doe",
        total: 99.99,
        status: "pending",
        created_at: "2024-12-01T10:00:00Z",
      },
      {
        id: 2,
        customer_name: "Jane Smith",
        total: 249.99,
        status: "shipped",
        created_at: "2024-11-15T14:30:00Z",
      },
    ];
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const dateFromInput = screen.getAllByDisplayValue("")[0];
    fireEvent.change(dateFromInput, { target: { value: "2024-12-01" } });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });

  it("shows add order form on button click", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    const addButton = screen.getByRole("button", { name: /Add Order/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Add New Order/i)).toBeInTheDocument();
    });
  });

  it("handles delete order with confirmation", async () => {
    const mockOrders = [
      {
        id: 1,
        customer_name: "John Doe",
        total: 99.99,
        status: "pending",
        created_at: "2024-12-01T10:00:00Z",
      },
    ];
    axios.get.mockResolvedValue({ data: mockOrders });
    axios.delete.mockResolvedValue({ status: 204 });

    global.confirm = jest.fn(() => true);

    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(axios.delete).toHaveBeenCalledWith("/api/orders/1");
    });
  });
});
