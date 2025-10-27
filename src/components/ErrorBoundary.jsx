import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const { darkMode } = this.props;
      const bgColor = darkMode ? '#1e1e1e' : '#f8fafc';
      const cardBg = darkMode ? '#252526' : '#ffffff';
      const textColor = darkMode ? '#e5e7eb' : '#1e293b';
      const borderColor = darkMode ? '#3e3e42' : '#e2e8f0';

      return (
        <div className="flex items-center justify-center h-screen" style={{backgroundColor: bgColor}}>
          <div className="max-w-2xl w-full mx-4 p-8 rounded-lg" style={{backgroundColor: cardBg, border: `1px solid ${borderColor}`}}>
            <div className="text-center mb-6">
              <AlertCircle size={64} className="mx-auto mb-4" style={{color: '#ef4444'}} />
              <h2 className="text-2xl font-bold mb-2" style={{color: textColor}}>
                Something went wrong
              </h2>
              <p className="text-sm" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                The application encountered an unexpected error
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 rounded" style={{backgroundColor: darkMode ? '#1a1a1a' : '#fef2f2', border: `1px solid ${darkMode ? '#3e3e42' : '#fecaca'}`}}>
                <p className="font-semibold mb-2" style={{color: '#ef4444', fontSize: '14px'}}>
                  Error: {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs overflow-auto max-h-40" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded text-white font-medium"
                style={{backgroundColor: '#2563eb'}}
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="px-6 py-2 rounded font-medium"
                style={{
                  backgroundColor: darkMode ? '#3e3e42' : '#f3f4f6',
                  color: textColor
                }}
              >
                Try Again
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
