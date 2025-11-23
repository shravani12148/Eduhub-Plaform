import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import AIAssistantSection from './AIAssistantSection';
import PlagiarismAnalyzer from './PlagiarismAnalyzer';
import BooksSection from './BooksSection';
import PaperSummarizer from './PaperSummarizer';
import './StudentDashboard.css';

const PGDashboard = () => {
    // Sidebar ref for direct toggle control
    const sidebarRef = useRef(null);
    
    // Sidebar content state
    const [activeContent, setActiveContent] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    
    // Handle sidebar content changes
    const handleContentChange = (content) => {
        setActiveContent(content);
    };

    // Handle sidebar collapse changes
    const handleCollapseChange = (isCollapsed) => {
        setSidebarCollapsed(isCollapsed);
    };

    // Handle hamburger button click - directly toggle sidebar via ref
    const handleHamburgerClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (sidebarRef.current) {
            sidebarRef.current.toggle();
        }
        return false;
    };
    
    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // No data loading needed after removing research tools and thesis help
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);
    
    // Welcome Dashboard for Postgraduate Students
    const WelcomeDashboard = () => (
        <div className="dashboard-welcome">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">🎓</span>
                        <span className="badge-text">Postgraduate Portal</span>
                    </div>
                    <h1 className="hero-title">Welcome to Your Research Hub</h1>
                    <p className="hero-subtitle">Advanced research tools, plagiarism detection, and AI-powered assistance for postgraduate excellence</p>
                </div>
                <div className="hero-illustration">
                    <div className="floating-card card-1">
                        <span className="card-emoji">🔬</span>
                    </div>
                    <div className="floating-card card-2">
                        <span className="card-emoji">📊</span>
                    </div>
                    <div className="floating-card card-3">
                        <span className="card-emoji">🎯</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card stat-card-primary">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">🔬</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">4</h3>
                        <p className="stat-label">Research Tools</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{width: '100%'}}></div>
                        </div>
                    </div>
                </div>
                <div className="stat-card stat-card-success">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">📊</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">100%</h3>
                        <p className="stat-label">Research Progress</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{width: '100%'}}></div>
                        </div>
                    </div>
                </div>
                <div className="stat-card stat-card-info">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">📝</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">A+</h3>
                        <p className="stat-label">Academic Excellence</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{width: '95%'}}></div>
                        </div>
                    </div>
                </div>
                <div className="stat-card stat-card-warning">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">🤖</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">24/7</h3>
                        <p className="stat-label">AI Support</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{width: '100%'}}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <div className="section-header-modern">
                    <h2 className="section-title-modern">Quick Access</h2>
                    <p className="section-subtitle-modern">Access your research and academic tools</p>
                </div>
                <div className="action-grid-modern">
                    <button 
                        className="action-card-modern action-card-learning"
                        onClick={() => setActiveContent('ai-assistant')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">🤖</div>
                            <div className="action-badge">Popular</div>
                        </div>
                        <h3 className="action-title">AI Assistant</h3>
                        <p className="action-description">Get advanced research assistance from AI for your studies</p>
                        <div className="action-footer">
                            <span className="action-link">Ask AI →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-quiz"
                        onClick={() => setActiveContent('plagiarism')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">🔍</div>
                            <div className="action-badge action-badge-success">Essential</div>
                        </div>
                        <h3 className="action-title">Plagiarism Check</h3>
                        <p className="action-description">Ensure originality and integrity of your research work</p>
                        <div className="action-footer">
                            <span className="action-link">Check Now →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-books"
                        onClick={() => setActiveContent('books')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">📚</div>
                            <div className="action-badge action-badge-info">Research</div>
                        </div>
                        <h3 className="action-title">Books Library</h3>
                        <p className="action-description">Access academic books and research materials from Google Books</p>
                        <div className="action-footer">
                            <span className="action-link">Browse →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-ai"
                        onClick={() => setActiveContent('paper-summarizer')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">📄</div>
                            <div className="action-badge action-badge-premium">AI Powered</div>
                        </div>
                        <h3 className="action-title">Paper Summarizer</h3>
                        <p className="action-description">Summarize research papers and generate literature reviews with AI</p>
                        <div className="action-footer">
                            <span className="action-link">Start Analysis →</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Features Overview */}
            <div className="features-overview">
                <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <h4>Advanced Research</h4>
                    <p>Cutting-edge tools</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🔒</div>
                    <h4>Secure Platform</h4>
                    <p>Data protection</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <h4>Progress Tracking</h4>
                    <p>Monitor research</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">💡</div>
                    <h4>Smart Insights</h4>
                    <p>AI-driven analysis</p>
                </div>
            </div>
        </div>
    );
    
    // Render content based on active sidebar item
    const renderContent = () => {
        switch (activeContent) {
            case 'ai-assistant':
                return <AIAssistantSection />;
            case 'plagiarism':
                return <PlagiarismAnalyzer />;
            case 'books':
                return <BooksSection />;
            case 'paper-summarizer':
                return <PaperSummarizer />;
            case 'dashboard':
                return <WelcomeDashboard />;
            default:
                return <WelcomeDashboard />;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Dashboard Header with Hamburger */}
            {sidebarCollapsed && (
                <div className="dashboard-header">
                    {/* Hamburger Button - Left Side */}
                    <button 
                        className="header-hamburger-btn"
                        onClick={handleHamburgerClick}
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                        title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                        type="button"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                    
                    <h1 className="header-title">PG Dashboard - Postgraduate</h1>
                    <p className="header-subtitle">Postgraduate Learning Management System</p>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar 
                ref={sidebarRef}
                onContentChange={handleContentChange} 
                onCollapseChange={handleCollapseChange}
                userType="pg" 
            />
            
            {/* Main Content */}
            <div className="main-content">
                <div className="content-wrapper">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default PGDashboard;