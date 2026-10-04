import { Component, ReactNode } from "react";

interface State {
  error: Error | null;
}

/**
 * Last line of defence: a render error or a failed lazy chunk (e.g. after a
 * redeploy invalidates old file names) shows a calm recovery screen instead of
 * a blank page.
 */
class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="error-screen" role="alert">
        <p className="error-kicker">Something went wrong</p>
        <h1>
          Let&apos;s try that <span className="serif-accent">again</span>
        </h1>
        <button type="button" onClick={() => window.location.reload()}>
          Reload the page
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
