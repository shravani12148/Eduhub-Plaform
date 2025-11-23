import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import UG_AIAssistantSection from './UG_AIAssistantSection';
import VoiceInterviewSection from './VoiceInterviewSection';
import PlagiarismAnalyzer from './PlagiarismAnalyzer';
import AIAssistant from './AIAssistant';
import Profile from './Profile';
import CareerPathModule from './CareerPathModule';
import MockInterview from './MockInterview';
import BooksSection from './BooksSection';
import api from '../api';
import './StudentDashboard.css';

const UGDashboard = () => {
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
    
    // State for existing features
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for the AI Career Coach
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [inputMethod, setInputMethod] = useState('file');

    // State for YouTube recommendations
    const [videoQuery, setVideoQuery] = useState('');
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [videoLoading, setVideoLoading] = useState(false);

    // Load courses on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const coursesRes = await fetch('/api/courses');
                if (coursesRes.ok) {
                    const coursesData = await coursesRes.json();
                    setCourses(coursesData);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Handle file selection for resume analysis
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setResumeText('');
        }
    };

    // Handle resume analysis
    const handleAnalyze = async () => {
        if (!selectedFile && !resumeText.trim()) {
            alert('Please upload a file or enter resume text.');
            return;
        }

        setAnalysisLoading(true);
        setAnalysisResult(null);
        
        try {
            let response;
            
            if (selectedFile) {
                // Send file as FormData
                const formData = new FormData();
                formData.append('resume', selectedFile);
                response = await api.post('/resume/analyze', formData);
            } else {
                // Send text as JSON
                response = await api.post('/resume/analyze', { resumeText });
            }

            if (response.status === 200) {
                // Transform backend response to match frontend expectations
                const transformedResult = {
                    strengths: response.data.analysis?.strengths || [],
                    improvements: response.data.analysis?.weaknesses || [],
                    careerSuggestions: response.data.careerRecommendations?.nextSteps || [],
                    skillsToDevelop: response.data.careerRecommendations?.skillRecommendations || []
                };
                setAnalysisResult(transformedResult);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            alert(error.response?.data?.error || 'Analysis failed. Please try again.');
        } finally {
            setAnalysisLoading(false);
        }
    };

    // Handle YouTube video search
    const handleVideoSearch = async (e) => {
        e.preventDefault();
        if (!videoQuery.trim()) return;

        setVideoLoading(true);
        setYoutubeVideos([]);
        
        try {
            const res = await api.post('/youtube/search', { query: videoQuery });
            
            if (res.status === 200) {
                setYoutubeVideos(res.data.videos || []);
            }
        } catch (err) {
            console.error("Failed to search videos", err);
            alert(err.response?.data?.error || "Sorry, there was an error searching for videos. Please try again.");
        } finally {
            setVideoLoading(false);
        }
    };

    const handleCourseVideoSearch = async (courseName) => {
        setVideoLoading(true);
        setYoutubeVideos([]);
        
        try {
            const res = await api.post('/youtube/course-videos', { courseName });
            
            if (res.status === 200) {
                setYoutubeVideos(res.data.videos || []);
            }
        } catch (err) {
            console.error("Failed to search course videos", err);
            alert(err.response?.data?.error || "Sorry, there was an error searching for course videos. Please try again.");
        } finally {
            setVideoLoading(false);
        }
    };

    // Welcome Dashboard Component
    const WelcomeDashboard = () => (
        <div className="dashboard-welcome">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">🎓</span>
                        <span className="badge-text">Undergraduate Portal</span>
                    </div>
                    <h1 className="hero-title">Welcome to Your Learning Hub</h1>
                    <p className="hero-subtitle">Empowering your undergraduate academic journey with AI-driven tools, career guidance, and comprehensive resources</p>
                </div>
                <div className="hero-illustration">
                    <div className="floating-card card-1">
                        <span className="card-emoji">🎯</span>
                    </div>
                    <div className="floating-card card-2">
                        <span className="card-emoji">💼</span>
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
                        <div className="stat-icon">🎯</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">5</h3>
                        <p className="stat-label">AI Tools Available</p>
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
                        <div className="stat-icon">💼</div>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">A+</h3>
                        <p className="stat-label">Career Ready</p>
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
                    <p className="section-subtitle-modern">Jump right into your career development tools</p>
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
                        <p className="action-description">Get instant help with your studies and assignments</p>
                        <div className="action-footer">
                            <span className="action-link">Ask AI →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-quiz"
                        onClick={() => setActiveContent('resume-analyzer')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">📄</div>
                            <div className="action-badge action-badge-success">Active</div>
                        </div>
                        <h3 className="action-title">Resume Analyzer</h3>
                        <p className="action-description">Optimize your resume with AI-powered insights</p>
                        <div className="action-footer">
                            <span className="action-link">Analyze →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-ai"
                        onClick={() => setActiveContent('mock-interview')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">🎤</div>
                            <div className="action-badge action-badge-premium">AI Powered</div>
                        </div>
                        <h3 className="action-title">Mock Interview</h3>
                        <p className="action-description">Practice interviews with AI-powered questions</p>
                        <div className="action-footer">
                            <span className="action-link">Start Practice →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-books"
                        onClick={() => setActiveContent('plagiarism')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">🔍</div>
                            <div className="action-badge action-badge-info">Essential</div>
                        </div>
                        <h3 className="action-title">Plagiarism Check</h3>
                        <p className="action-description">Ensure originality in your academic work</p>
                        <div className="action-footer">
                            <span className="action-link">Check Now →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-learning"
                        onClick={() => setActiveContent('career-path')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">🎯</div>
                            <div className="action-badge">New</div>
                        </div>
                        <h3 className="action-title">Career Path</h3>
                        <p className="action-description">Explore higher studies and career opportunities</p>
                        <div className="action-footer">
                            <span className="action-link">Explore →</span>
                        </div>
                    </button>
                    <button 
                        className="action-card-modern action-card-books"
                        onClick={() => setActiveContent('books')}
                    >
                        <div className="action-card-header">
                            <div className="action-icon-modern">📚</div>
                            <div className="action-badge action-badge-info">Library</div>
                        </div>
                        <h3 className="action-title">Books Library</h3>
                        <p className="action-description">Access millions of educational books from Google Books</p>
                        <div className="action-footer">
                            <span className="action-link">Browse →</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Features Overview */}
            <div className="features-overview">
                <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <h4>AI-Powered Tools</h4>
                    <p>Advanced technology</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🔒</div>
                    <h4>Secure Platform</h4>
                    <p>Your data protected</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <h4>Career Tracking</h4>
                    <p>Monitor your progress</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">💡</div>
                    <h4>Smart Guidance</h4>
                    <p>Personalized recommendations</p>
                </div>
            </div>
        </div>
    );

    // Resume Analyzer Component
    const ResumeAnalyzer = () => (
        <div className="resume-analyzer">
            <div className="section-header">
                <h1 className="section-title">AI Career Coach</h1>
                <p className="section-subtitle">Get personalized career guidance and resume optimization</p>
            </div>

            <div className="analyzer-container">
                <div className="input-section">
                    <h3>Upload Your Resume</h3>
                    
                    <div className="input-method-selector">
                        <button 
                            className={`method-btn ${inputMethod === 'file' ? 'active' : ''}`}
                            onClick={() => setInputMethod('file')}
                        >
                            Upload File
                        </button>
                        <button 
                            className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
                            onClick={() => setInputMethod('text')}
                        >
                            Paste Text
                        </button>
                    </div>

                    {inputMethod === 'file' ? (
                        <div className="file-upload">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                                id="resume-file-input"
                                className="file-input"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="resume-file-input" className="file-upload-label">
                                <div className="upload-icon">📄</div>
                                <div className="upload-text">
                                    {selectedFile ? (
                                        <>
                                            <strong>✓ File selected:</strong> {selectedFile.name}
                                        </>
                                    ) : (
                                        <>
                                            <strong>Click to upload</strong> or drag and drop
                                            <br />
                                            <small>PDF, DOC, DOCX, or TXT (Max 10MB)</small>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="text-input">
                            <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                placeholder="Paste your resume content here..."
                                className="resume-textarea"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={analysisLoading || (!selectedFile && !resumeText.trim())}
                        className="analyze-btn"
                    >
                        {analysisLoading ? (
                            <>
                                <span className="spinner"></span>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Analyze Resume
                            </>
                        )}
                    </button>
                </div>

                {analysisResult && (
                    <div className="analysis-results">
                        <h3>Analysis Results</h3>
                        <div className="results-grid">
                            <div className="result-card strengths">
                                <h4>Strengths</h4>
                                <ul>
                                    {analysisResult.strengths.map((strength, index) => (
                                        <li key={index}>{strength}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="result-card improvements">
                                <h4>Areas for Improvement</h4>
                                <ul>
                                    {analysisResult.improvements.map((improvement, index) => (
                                        <li key={index}>{improvement}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="result-card career">
                                <h4>Career Suggestions</h4>
                                <ol>
                                    {analysisResult.careerSuggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ol>
                            </div>
                            <div className="result-card skills">
                                <h4>Skills to Develop</h4>
                                <ol>
                                    {analysisResult.skillsToDevelop.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // YouTube Videos Component
    const YouTubeVideos = () => (
        <div className="youtube-videos">
            <div className="section-header">
                <h1 className="section-title">Educational Video Library</h1>
                <p className="section-subtitle">Discover curated educational content to enhance your learning</p>
            </div>

            <div className="video-search">
                <form onSubmit={handleVideoSearch} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={videoQuery}
                            onChange={(e) => setVideoQuery(e.target.value)}
                            placeholder="Search for educational videos..."
                            className="search-input"
                        />
                        <button type="submit" disabled={videoLoading} className="search-btn">
                            {videoLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Searching...
                                </>
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>
                </form>

                <div className="course-tags">
                    <h4>Popular Topics:</h4>
                    <div className="tag-list">
                        {['JavaScript', 'Python', 'Data Structures', 'Algorithms', 'Web Development', 'Machine Learning'].map(course => (
                            <button
                                key={course}
                                onClick={() => handleCourseVideoSearch(course)}
                                disabled={videoLoading}
                                className="course-tag"
                            >
                                {course}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {videoLoading && (
                <div className="loading-state">
                    <span className="spinner"></span>
                    <p>Searching for videos...</p>
                </div>
            )}

            {youtubeVideos.length > 0 && (
                <div className="video-results">
                    <h3>Recommended Videos</h3>
                    <div className="video-grid">
                        {youtubeVideos.map((video, index) => (
                            <div key={index} className="video-card">
                                <div className="video-info">
                                    <h4 className="video-title">{video.title}</h4>
                                    <p className="video-channel">{video.channelTitle}</p>
                                    <p className="video-description">{video.description}</p>
                                </div>
                                <a 
                                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="watch-btn"
                                >
                                    Watch on YouTube
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // Render content based on active sidebar item
    const renderContent = () => {
        switch (activeContent) {
            case 'dashboard':
                return <WelcomeDashboard />;
            case 'ai-assistant':
                return <UG_AIAssistantSection />;
            case 'voice-interview':
                return <VoiceInterviewSection />;
            case 'plagiarism':
                return <PlagiarismAnalyzer />;
            case 'resume-analyzer':
                return <ResumeAnalyzer />;
            case 'youtube-videos':
                return <YouTubeVideos />;
            case 'career-path':
                return <CareerPathModule />;
            case 'mock-interview':
                return <MockInterview />;
            case 'books':
                return <BooksSection />;
            default:
                return <WelcomeDashboard />;
        }
    };

    return (
        <div className="dashboard-container">
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
                    
                    <h1 className="header-title">EduPlatform - Undergraduate</h1>
                    <p className="header-subtitle">Undergraduate Learning Management System</p>
                </div>
            )}

            {/* Sidebar - Now integrated directly without drawer wrapper */}
            <Sidebar 
                ref={sidebarRef}
                onContentChange={(content) => {
                    handleContentChange(content);
                }} 
                onCollapseChange={handleCollapseChange} 
                userType="ug" 
            />
            
            <div className="main-content">
                <div className="content-wrapper">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UGDashboard;