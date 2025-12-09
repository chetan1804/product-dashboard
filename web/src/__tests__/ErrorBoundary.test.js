import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorPage, { LoadingError, ErrorAlert } from "../components/ErrorPage";
import "@testing-library/jest-dom";

/**
 * ErrorBoundary Tests
 * Verifies error boundary catches and displays errors gracefully
 */
describe("ErrorBoundary", () => {
  // Suppress console.error for these tests since we're testing error scenarios
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders error fallback UI when child component throws", () => {
    const ThrowError = () => {
      throw new Error("Test error message");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong/)).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });

  it("provides Try Again button to reset error state", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const tryAgainBtn = screen.getByRole("button", { name: /Try Again/i });
    expect(tryAgainBtn).toBeInTheDocument();
  });

  it("provides Go Home button to navigate to root", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const goHomeBtn = screen.getByRole("button", { name: /Go Home/i });
    expect(goHomeBtn).toBeInTheDocument();
  });

  it("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("Error Details (Development Only)")
    ).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});

/**
 * ErrorPage Tests
 * Verifies error page displays appropriate error UI for different error codes
 */
describe("ErrorPage", () => {
  it("renders 404 error with correct icon and message", () => {
    render(<ErrorPage statusCode={404} />);

    expect(screen.getByText("🔍")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText(/does not exist/)).toBeInTheDocument();
  });

  it("renders 403 error for access denied", () => {
    render(<ErrorPage statusCode={403} />);

    expect(screen.getByText("🔒")).toBeInTheDocument();
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByText(/permission/)).toBeInTheDocument();
  });

  it("renders 500 server error", () => {
    render(<ErrorPage statusCode={500} />);

    expect(screen.getByText("⚠️")).toBeInTheDocument();
    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });

  it("displays error code", () => {
    render(<ErrorPage statusCode={502} />);

    expect(screen.getByText(/Error Code: 502/)).toBeInTheDocument();
  });

  it("renders custom title and message", () => {
    render(
      <ErrorPage
        statusCode={400}
        title="Custom Error"
        message="Custom message here"
      />
    );

    expect(screen.getByText("Custom Error")).toBeInTheDocument();
    expect(screen.getByText("Custom message here")).toBeInTheDocument();
  });

  it("calls onRetry callback when retry button clicked", () => {
    const onRetry = jest.fn();
    render(<ErrorPage statusCode={500} onRetry={onRetry} />);

    fireEvent.click(screen.getByRole("button", { name: /Try Again/i }));
    expect(onRetry).toHaveBeenCalled();
  });
});

/**
 * LoadingError Tests
 * Verifies LoadingError component displays error with retry capability
 */
describe("LoadingError", () => {
  it("renders error message and icon", () => {
    render(<LoadingError error="Test error" message="Custom message" />);

    expect(screen.getByText("⚠️")).toBeInTheDocument();
    expect(screen.getByText("Custom message")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", () => {
    const onRetry = jest.fn();
    render(
      <LoadingError error="Test error" message="Failed" onRetry={onRetry} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("does not show retry button when onRetry not provided", () => {
    render(<LoadingError error="Test error" message="Failed" />);

    expect(
      screen.queryByRole("button", { name: /Retry/i })
    ).not.toBeInTheDocument();
  });
});

/**
 * ErrorAlert Tests
 * Verifies ErrorAlert component displays dismissible error messages
 */
describe("ErrorAlert", () => {
  it("renders error message", () => {
    render(<ErrorAlert message="Error occurred" type="error" />);

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("displays error icon", () => {
    render(<ErrorAlert message="Error" type="error" />);

    expect(screen.getByText("❌")).toBeInTheDocument();
  });

  it("displays warning icon for warning type", () => {
    render(<ErrorAlert message="Warning" type="warning" />);

    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });

  it("displays info icon for info type", () => {
    render(<ErrorAlert message="Info" type="info" />);

    expect(screen.getByText("ℹ️")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(<ErrorAlert message="Error" type="error" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /Close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("does not show close button when onClose not provided", () => {
    render(<ErrorAlert message="Error" type="error" />);

    expect(
      screen.queryByRole("button", { name: /Close/i })
    ).not.toBeInTheDocument();
  });
});
