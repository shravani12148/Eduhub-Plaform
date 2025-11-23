import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import LearningVideosSection from './LearningVideosSection';
import QuizSection from './QuizSection';
import AIAssistantSection from './AIAssistantSection';
import BooksSection from './BooksSection';
import './StudentDashboard.css';

const StudentDashboard = () => {
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
    
    // Welcome Dashboard for Students
    const WelcomeDashboard = () => (
        <div className="dashboard-welcome">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">🎓</span>
                        <span className="badge-text">Student Portal</span>
                    </div>
                    <h1 className="hero-title">Welcome to Your Learning Hub</h1>
                    <p className="hero-subtitle">Empowering your academic journey with cutting-edge learning tools, interactive quizzes, and AI-powered assistance</p>
                </div>
                <div className="hero-illustration">
                    <div className="floating-card card-1">
                        <span className="card-emoji">📚</span>
                    </div>
                    <div className="floating-card card-2">
                        <span className="card-emoji">🎯</span>
                    </div>
                    <div className="floating-card card-3">
                        <span className="card-emoji">🚀</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card stat-card-primary">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">📚</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">4</h3>
                        <p className="stat-label">Learning Tools</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{width: '100%'}}></div>
                        </div>
                    </div>
                </div>
                <div className="stat-card stat-card-success">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">📈</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">100%</h3>
                        <p className="stat-label">Learning Progress</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{width: '100%'}}></div>
                        </div>
                    </div>
                </div>
                <div className="stat-card stat-card-info">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">⭐</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">A+</h3>
                        <p className="stat-label">Average Grade</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{width: '95%'}}></div>
                        </div>
                    </div>
                </div>
                <div className="stat-card stat-card-warning">
                    <div className="stat-icon-wrapper">
                        <div className="stat-icon">🎯</div>
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
                    <p className="section-subtitle-modern">Jump right into your learning experience</p>
                </div>
                <div className="action-grid-modern">
                    <button 
                        className="action-card-modern action-card-learning"
                        onClick={() => setActiveContent('learning')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">📚</div>
                            <div className="action-badge">Popular</div>
                        </div>
                        <h3 className="action-title">Learning Videos</h3>
                        <p className="action-description">Access comprehensive course materials and educational videos</p>
                        <div className="action-footer">
                            <span className="action-link">Explore Now →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-books"
                        onClick={() => setActiveContent('books')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">📖</div>
                            <div className="action-badge action-badge-info">New</div>
                        </div>
                        <h3 className="action-title">Books Library</h3>
                        <p className="action-description">Search and access millions of educational books from Google Books</p>
                        <div className="action-footer">
                            <span className="action-link">Browse Books →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-quiz"
                        onClick={() => setActiveContent('quiz')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">📝</div>
                            <div className="action-badge action-badge-success">Active</div>
                        </div>
                        <h3 className="action-title">Quizzes</h3>
                        <p className="action-description">Test your knowledge with interactive quizzes and assessments</p>
                        <div className="action-footer">
                            <span className="action-link">Start Quiz →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-ai"
                        onClick={() => setActiveContent('ai-assistant')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">🤖</div>
                            <div className="action-badge action-badge-premium">AI Powered</div>
                        </div>
                        <h3 className="action-title">AI Assistant</h3>
                        <p className="action-description">Get instant help from your personal AI tutor anytime</p>
                        <div className="action-footer">
                            <span className="action-link">Ask AI →</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Features Overview */}
            <div className="features-overview">
                <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <h4>Fast Learning</h4>
                    <p>Accelerate your progress</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🔒</div>
                    <h4>Secure Platform</h4>
                    <p>Your data is protected</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <h4>Track Progress</h4>
                    <p>Monitor your growth</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">💡</div>
                    <h4>Smart Insights</h4>
                    <p>AI-driven recommendations</p>
                </div>
            </div>
        </div>
    );
    
    // Render content based on active sidebar item
    const renderContent = () => {
        switch (activeContent) {
            case 'learning':
                return <LearningVideosSection />;
            case 'books':
                return <BooksSection />;
            case 'quiz':
                return <QuizSection />;
            case 'ai-assistant':
                return <AIAssistantSection />;
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
                    
                    <h1 className="header-title">Student Dashboard</h1>
                    <p className="header-subtitle">Student Learning Portal</p>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar 
                ref={sidebarRef}
                onContentChange={handleContentChange} 
                onCollapseChange={handleCollapseChange}
                userType="student" 
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

export default StudentDashboard;