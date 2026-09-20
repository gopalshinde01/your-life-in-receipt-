import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full p-8 my-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-center flex flex-col items-center justify-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-red-900/60 border border-red-700/50 flex items-center justify-center text-red-300 text-xl" aria-hidden="true">
            ⚠️
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-200">
              {this.props.fallbackTitle || 'Something went wrong.'}
            </h2>
            <p className="text-sm text-red-300/80 max-w-md mt-1">
              {this.props.fallbackMessage ||
                'An unexpected error occurred while rendering this component. You can attempt recovery below.'}
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={this.handleReset}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
