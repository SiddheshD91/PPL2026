import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: 'white',
            color: '#333',
            padding: '40px',
            borderRadius: '12px',
            maxWidth: '600px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <h1 style={{ color: '#e74c3c', marginTop: 0 }}>⚠️ Application Error</h1>
            <p><strong>Error:</strong> {this.state.error?.message || 'Unknown error occurred'}</p>
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0 }}>Common Solutions:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Check browser console for detailed error messages</li>
                <li>Verify Firebase configuration in <code>.env</code> file</li>
                <li>Ensure all Firebase services are enabled in Firebase Console</li>
                <li>Check that Firestore and Storage rules are published</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

