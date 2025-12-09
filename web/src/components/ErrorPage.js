import React from "react";

/**
 * ErrorPage — reusable error display component for different error types
 * Used by ErrorBoundary and for API/async errors
 */
const ErrorPage = ({
  statusCode = 500,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  onRetry = null,
  onGoHome = true,
}) => {
  const getErrorIcon = () => {
    if (statusCode === 404) return "🔍";
    if (statusCode === 403) return "🔒";
    if (statusCode === 500 || statusCode === 502) return "⚠️";
    return "❌";
  };

  const getErrorTitle = () => {
    if (statusCode === 404) return "Page Not Found";
    if (statusCode === 403) return "Access Denied";
    if (statusCode === 500) return "Server Error";
    return title;
  };

  const getErrorMessage = () => {
    if (statusCode === 404)
      return "The page you are looking for does not exist.";
    if (statusCode === 403)
      return "You do not have permission to access this resource.";
    if (statusCode === 500)
      return "An internal server error occurred. Please try again later.";
    return message;
  };

  return (
    <div className="error-page">
      <div className="error-page-content">
        <div className="error-icon">{getErrorIcon()}</div>
        <h1 className="error-title">{getErrorTitle()}</h1>
        <p className="error-description">{getErrorMessage()}</p>

        <div className="error-code">
          <small>Error Code: {statusCode}</small>
        </div>

        <div className="error-actions">
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              Try Again
            </button>
          )}
          {onGoHome && (
            <button
              onClick={() => (window.location.href = "/")}
              className="btn-secondary">
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * LoadingError — shows error state for failed data fetching
 * Used within components when API calls fail
 */
export const LoadingError = ({
  error,
  onRetry,
  message = "Failed to load data",
}) => (
  <div className="loading-error">
    <p className="error-icon">⚠️</p>
    <p className="error-text">{message}</p>
    {error && <p className="error-details">{error}</p>}
    {onRetry && (
      <button onClick={onRetry} className="btn-small">
        Retry
      </button>
    )}
  </div>
);

/**
 * ErrorAlert — dismissible alert for inline error messages
 * Used for form validation errors, API errors, etc.
 */
export const ErrorAlert = ({ message, onClose = null, type = "error" }) => (
  <div className={`error-alert alert-${type}`}>
    <span className="alert-icon">
      {type === "error" ? "❌" : type === "warning" ? "⚠️" : "ℹ️"}
    </span>
    <span className="alert-message">{message}</span>
    {onClose && (
      <button onClick={onClose} className="alert-close" aria-label="Close">
        ×
      </button>
    )}
  </div>
);

export default ErrorPage;
