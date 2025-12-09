import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Products from "../pages/Products";
import productsReducer from "../redux/slices/productsSlice";
import axios from "axios";

jest.mock("axios");

describe("Products Page", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
      },
    });
    jest.clearAllMocks();
  });

  it("renders products page with title", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );
    expect(
      screen.getByRole("heading", { name: /Products/i })
    ).toBeInTheDocument();
  });

  it("loads and displays products on mount", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Laptop",
        price: 999.99,
        stock: 5,
        category: "Electronics",
      },
      {
        id: 2,
        title: "Mouse",
        price: 29.99,
        stock: 50,
        category: "Electronics",
      },
    ];
    axios.get.mockResolvedValue({ data: mockProducts });

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.getByText("Mouse")).toBeInTheDocument();
    });
  });

  it("filters products by search term with debounce", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Laptop",
        price: 999.99,
        stock: 5,
        category: "Electronics",
      },
      {
        id: 2,
        title: "Mouse",
        price: 29.99,
        stock: 50,
        category: "Electronics",
      },
    ];
    axios.get.mockResolvedValue({ data: mockProducts });

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText(/Search products/i);
    fireEvent.change(searchInput, { target: { value: "Laptop" } });

    // Wait for debounce (300ms) and filter to apply
    await waitFor(
      () => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it("filters products by category", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Laptop",
        price: 999.99,
        stock: 5,
        category: "Electronics",
      },
      {
        id: 2,
        title: "Chair",
        price: 199.99,
        stock: 10,
        category: "Furniture",
      },
    ];
    axios.get.mockResolvedValue({ data: mockProducts });

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });

    const categorySelect = screen.getByDisplayValue(/All Categories/i);
    fireEvent.change(categorySelect, { target: { value: "Electronics" } });

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeInTheDocument();
      expect(screen.queryByText("Chair")).not.toBeInTheDocument();
    });
  });

  it("handles pagination", async () => {
    const mockProducts = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      price: 100 + i,
      stock: 10,
      category: "Test",
    }));
    axios.get.mockResolvedValue({ data: mockProducts });

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Product 6")).toBeInTheDocument();
    });
  });

  it("shows form validation errors", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    const submitButton = screen.getByRole("button", { name: /Add Product/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Title required/i)).toBeInTheDocument();
    });
  });
});
