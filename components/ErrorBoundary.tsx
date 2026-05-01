'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4 p-8 bg-surface rounded-xl shadow-card text-center">
            {/* Error Icon */}
            <div className="text-6xl mb-4">😔</div>
            
            {/* Error Title */}
            <h1 className="text-2xl font-bold text-secondary mb-2">
              Something went wrong
            </h1>
            
            {/* Error Message */}
            <p className="text-gray-500 mb-6">
              We encountered an unexpected error. Please try again or return to the home page.
            </p>
            
            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-sm font-mono text-error break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary"
              >
                Try Again
              </button>
              
              <Link href="/" className="btn-secondary text-center">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for manually triggering error boundary
export function useErrorHandler() {
  const [, setState] = React.useState<{ hasError: boolean }>({ hasError: false });

  return (error: Error) => {
    setState({ hasError: true });
    throw error;
  };
}

// Import React for useErrorHandler hook
import React from 'react';

export default ErrorBoundary;