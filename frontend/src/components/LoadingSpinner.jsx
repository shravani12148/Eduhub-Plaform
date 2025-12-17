import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium', fullScreen = false }) => {
    const spinnerContent = (
        <div className={`loading-spinner-container ${size}`}>
            <div className="spinner"></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="loading-spinner-overlay">
                {spinnerContent}
            </div>
        );
    }

    return spinnerContent;
};

export default LoadingSpinner;

