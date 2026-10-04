import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, forward to telemetry/Sentry/LogRocket here
    console.error("ErrorBoundary caught an unhandled runtime exception:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetSession = () => {
    try {
      localStorage.removeItem("proppulse_prediction_history");
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-app, #090E1A)',
          color: 'var(--text-primary, #F8FAFC)',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: 'var(--bg-surface, #0F172A)',
            border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              color: '#F43F5E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
              PropPulse encountered an unexpected runtime error. Your local data has been preserved.
            </p>

            {this.state.error && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                textAlign: 'left',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#F43F5E',
                marginBottom: '1.75rem',
                overflowX: 'auto',
                border: '1px solid rgba(244, 63, 94, 0.2)'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={16} />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleResetSession}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary, #94A3B8)',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
                  cursor: 'pointer'
                }}
              >
                <span>Clear Cache &amp; Reset</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
