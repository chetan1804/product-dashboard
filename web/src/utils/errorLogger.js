/**
 * Error Logging Utility
 * Centralized error handling and logging for the application
 * Can be extended to send errors to external services (e.g., Sentry, LogRocket)
 */

const LOG_LEVELS = {
  ERROR: "ERROR",
  WARNING: "WARNING",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const errorLogger = {
  /**
   * Log an error with context
   */
  logError: (error, context = {}) => {
    const timestamp = new Date().toISOString();
    const errorObj = {
      level: LOG_LEVELS.ERROR,
      timestamp,
      message: error.message || String(error),
      stack: error.stack,
      context,
    };

    console.error(`[${timestamp}] Error:`, errorObj);

    // In production, send to error tracking service
    // Examples: Sentry, LogRocket, Bugsnag
    // sendToErrorService(errorObj)

    return errorObj;
  },

  /**
   * Log a warning
   */
  logWarning: (message, context = {}) => {
    const timestamp = new Date().toISOString();
    const warningObj = {
      level: LOG_LEVELS.WARNING,
      timestamp,
      message,
      context,
    };

    console.warn(`[${timestamp}] Warning:`, warningObj);
    return warningObj;
  },

  /**
   * Log info/debug message
   */
  logInfo: (message, context = {}) => {
    const timestamp = new Date().toISOString();
    const infoObj = {
      level: LOG_LEVELS.INFO,
      timestamp,
      message,
      context,
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`[${timestamp}] Info:`, infoObj);
    }
    return infoObj;
  },

  /**
   * Log API error with request details
   */
  logApiError: (error, endpoint, method = "GET", statusCode = null) => {
    const errorObj = {
      level: LOG_LEVELS.ERROR,
      timestamp: new Date().toISOString(),
      type: "API_ERROR",
      endpoint,
      method,
      statusCode,
      message: error.message || String(error),
      stack: error.stack,
    };

    console.error("[API Error]", errorObj);

    // Send to monitoring service in production
    // sendToErrorService(errorObj)

    return errorObj;
  },

  /**
   * Get user-friendly error message from API error
   */
  getUserFriendlyMessage: (error, defaultMessage = "An error occurred") => {
    if (error.response?.status === 404) {
      return "Resource not found";
    }
    if (error.response?.status === 403) {
      return "You do not have permission to perform this action";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please log in again.";
    }
    if (error.response?.status >= 500) {
      return "Server error. Please try again later.";
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message === "Network Error") {
      return "Network connection failed. Please check your internet.";
    }
    return error.message || defaultMessage;
  },

  /**
   * Handle Redux thunk errors
   */
  handleThunkError: (error, action) => {
    errorLogger.logError(error, {
      action: action || "Unknown",
      type: "REDUX_THUNK_ERROR",
    });

    return {
      message: errorLogger.getUserFriendlyMessage(error),
      originalError: error,
    };
  },
};

export default errorLogger;
