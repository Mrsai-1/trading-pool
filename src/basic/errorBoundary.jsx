import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    // Log error to the console (for local debugging)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Optionally send error details to a server or monitoring service
    this.logErrorToServer(error, errorInfo);
  }

  logErrorToServer = (error, errorInfo) => {
    fetch("/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-5">
          <h1>Something went wrong!</h1>
          <p>{this.state.error?.toString()}</p>
          <pre>{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
