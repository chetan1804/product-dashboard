import React from "react";

/**
 * ErrorBoundary — catches JavaScript errors anywhere in child component tree
 * Logs error and displays fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and external service (in production)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send error to error logging service
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <div className="error-container">
            <h1>⚠️ Oops! Something went wrong</h1>
            <p className="error-message">
              {this.state.error && this.state.error.toString()}
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="error-actions">
              <button onClick={this.handleReset} className="btn-primary">
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="btn-secondary">
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
