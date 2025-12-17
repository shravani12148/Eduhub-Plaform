import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Login.css'; // Reuse login styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validate email
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            // Since password reset isn't implemented in backend yet,
            // we'll show a helpful message
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            
            setEmailSent(true);
            setMessage(`Password reset instructions will be sent to ${email} once the feature is fully implemented.`);
            
            // In a real implementation, you would call:
            // await api.post('/auth/forgot-password', { email });
            
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Visual Content */}
            <div className="login-visual">
                <div className="visual-content">
                    <div className="visual-header">
                        <h2>Reset Your Password</h2>
                        <p>We'll help you get back to learning</p>
                    </div>
                    <div className="visual-features">
                        <div className="feature-item">
                            <div className="feature-icon">🔒</div>
                            <div className="feature-text">
                                <h3>Secure Process</h3>
                                <p>Your security is our priority</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">📧</div>
                            <div className="feature-text">
                                <h3>Email Verification</h3>
                                <p>Reset link sent to your inbox</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">⚡</div>
                            <div className="feature-text">
                                <h3>Quick Recovery</h3>
                                <p>Get back to your account fast</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="visual-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="login-form-section">
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <Link to="/login" className="back-home">
                            ← Back to Login
                        </Link>
                        <h1>Forgot Password?</h1>
                        <p>Enter your email to receive reset instructions</p>
                    </div>

                    {/* Success Message */}
                    {emailSent && message && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#d4edda',
                            border: '1px solid #c3e6cb',
                            borderRadius: '8px',
                            color: '#155724',
                            marginBottom: '1.5rem'
                        }}>
                            <strong>✓ Request Received!</strong>
                            <p style={{ margin: '0.5rem 0 0 0' }}>{message}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {!emailSent ? (
                        <>
                            {/* Form */}
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your registered email"
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className={`submit-btn ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            {/* Additional Info */}
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                backgroundColor: '#fff3cd',
                                border: '1px solid #ffc107',
                                borderRadius: '8px',
                                fontSize: '0.9rem'
                            }}>
                                <strong>⚠️ Note:</strong> Password reset functionality is currently being implemented. 
                                Please contact your administrator for password reset assistance.
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link to="/login" className="submit-btn" style={{ 
                                textDecoration: 'none',
                                display: 'inline-block',
                                width: 'auto',
                                padding: '1rem 2rem'
                            }}>
                                Return to Login
                            </Link>
                        </div>
                    )}

                    {/* Login Link */}
                    <div className="register-link">
                        Remember your password? <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

