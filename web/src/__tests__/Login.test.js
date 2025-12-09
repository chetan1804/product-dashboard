import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

test("renders login and validates required fields", async () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );

  const btn = screen.getByRole("button", { name: /login/i });
  fireEvent.click(btn);

  expect(await screen.findByText(/Username required/i)).toBeInTheDocument();
  expect(await screen.findByText(/Password required/i)).toBeInTheDocument();
});
