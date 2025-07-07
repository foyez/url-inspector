import { Component } from "react";
import type { ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 text-center mt-10">
          <h1>Something went wrong.</h1>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
