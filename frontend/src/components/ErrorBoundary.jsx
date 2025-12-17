import React from 'react';

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
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '2rem auto',
                    backgroundColor: '#fee',
                    borderRadius: '8px',
                    border: '1px solid #fcc'
                }}>
                    <h2 style={{ color: '#c33' }}>⚠️ Something went wrong</h2>
                    <p style={{ color: '#666' }}>
                        We're sorry, but something unexpected happened. Please try refreshing the page.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ 
                            marginTop: '1rem', 
                            textAlign: 'left',
                            backgroundColor: '#fff',
                            padding: '1rem',
                            borderRadius: '4px'
                        }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                Error Details
                            </summary>
                            <pre style={{ 
                                fontSize: '0.85rem', 
                                overflow: 'auto',
                                marginTop: '0.5rem'
                            }}>
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

