import React, { useState } from 'react';
import api from '../api';
import './PaperSummarizer.css';

const PaperSummarizer = () => {
    const [activeTab, setActiveTab] = useState('summarizer');
    const [inputMethod, setInputMethod] = useState('text');
    const [paperText, setPaperText] = useState('');
    const [paperFile, setPaperFile] = useState(null);
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [numPapers, setNumPapers] = useState(10);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaperFile(file);
            setPaperText('');
        }
    };

    const handleSummarize = async () => {
        if (!paperFile && !paperText.trim()) {
            setError('Please upload a file or paste text to summarize.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            console.log('Starting summarization...');
            let response;
            
            if (paperFile) {
                console.log('Uploading file:', paperFile.name, 'Size:', paperFile.size);
                // Send file as FormData
                const formData = new FormData();
                formData.append('paper', paperFile);
                
                console.log('Sending request to backend...');
                response = await api.post('/paper-summarizer/summarize', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 120000, // 2 minutes timeout
                });
                console.log('Response received:', response.status);
            } else {
                console.log('Sending text, length:', paperText.length);
                // Send text as JSON
                response = await api.post('/paper-summarizer/summarize', { 
                    paperText: paperText 
                }, {
                    timeout: 120000, // 2 minutes timeout
                });
                console.log('Response received:', response.status);
            }

            if (response.status === 200 && response.data) {
                console.log('Summary data received:', response.data);
                setResult(response.data);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('=== Summarization Error ===');
            console.error('Error object:', err);
            console.error('Response data:', err.response?.data);
            console.error('Response status:', err.response?.status);
            console.error('Error message:', err.message);
            
            let errorMessage = 'Failed to summarize the paper. ';
            
            if (err.code === 'ECONNABORTED') {
                errorMessage += 'Request timeout. The paper might be too long or the server is processing slowly.';
            } else if (err.response?.status === 400) {
                errorMessage = err.response?.data?.error || 'Invalid paper format or content.';
            } else if (err.response?.status === 500) {
                errorMessage = err.response?.data?.error || 'Server error. Please check if the backend server is running.';
                if (err.response?.data?.details) {
                    errorMessage += ` Details: ${err.response.data.details}`;
                }
            } else if (err.message === 'Network Error') {
                errorMessage = 'Cannot connect to server. Please ensure the backend server is running on port 5001.';
            } else {
                errorMessage += err.response?.data?.error || err.message || 'Please try again.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReview = async () => {
        if (!topic.trim()) {
            setError('Please enter a research topic.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await api.post('/paper-summarizer/literature-review', {
                topic: topic,
                keywords: keywords,
                numPapers: numPapers
            });

            if (response.status === 200 && response.data) {
                setResult(response.data);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Review generation error:', err);
            const errorMessage = err.response?.data?.error || 'Failed to generate literature review. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        let content = '';
        
        if (activeTab === 'summarizer') {
            content = `PAPER SUMMARY\n`;
            content += `=============\n\n`;
            content += `Title: ${result.title || 'Research Paper'}\n\n`;
            content += `SUMMARY\n`;
            content += `-------\n`;
            content += `${result.summary}\n\n`;
            content += `KEY POINTS\n`;
            content += `----------\n`;
            result.keyPoints.forEach((point, i) => {
                content += `${i + 1}. ${point}\n`;
            });
            content += `\nMETHODOLOGY\n`;
            content += `-----------\n`;
            content += `${result.methodology}\n\n`;
            content += `CONCLUSIONS\n`;
            content += `-----------\n`;
            content += `${result.conclusions}\n`;
        } else {
            content = `LITERATURE REVIEW\n`;
            content += `=================\n\n`;
            content += `Topic: ${result.topic}\n\n`;
            content += `INTRODUCTION\n`;
            content += `------------\n`;
            content += `${result.introduction}\n\n`;
            content += `KEY THEMES\n`;
            content += `----------\n`;
            result.keyThemes.forEach((theme, i) => {
                content += `${i + 1}. ${theme}\n`;
            });
            content += `\nMAJOR FINDINGS\n`;
            content += `--------------\n`;
            result.majorFindings.forEach((finding, i) => {
                content += `${i + 1}. ${finding}\n`;
            });
            content += `\nRESEARCH GAPS\n`;
            content += `-------------\n`;
            result.researchGaps.forEach((gap, i) => {
                content += `${i + 1}. ${gap}\n`;
            });
            content += `\nRECOMMENDATIONS\n`;
            content += `---------------\n`;
            result.recommendations.forEach((rec, i) => {
                content += `${i + 1}. ${rec}\n`;
            });
            content += `\nREFERENCES\n`;
            content += `----------\n`;
            result.references.forEach((ref, i) => {
                content += `${i + 1}. ${ref}\n`;
            });
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = activeTab === 'summarizer' ? 'paper_summary.txt' : 'literature_review.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="paper-summarizer">
            {/* Header */}
            <div className="summarizer-header">
                <div className="header-content">
                    <div className="header-badge">
                        <span className="badge-icon">📄</span>
                        <span className="badge-text">AI Research Assistant</span>
                    </div>
                    <h1 className="header-title">Paper Summarizer & Literature Review Generator</h1>
                    <p className="header-subtitle">Leverage AI to summarize research papers and generate comprehensive literature reviews</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'summarizer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summarizer')}
                >
                    <span className="tab-icon">📝</span>
                    Paper Summarizer
                </button>
                <button
                    className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
                    onClick={() => setActiveTab('review')}
                >
                    <span className="tab-icon">📚</span>
                    Literature Review Generator
                </button>
            </div>

            {/* Content Area */}
            <div className="summarizer-content">
                {activeTab === 'summarizer' ? (
                    <div className="summarizer-panel">
                        <div className="input-section">
                            <h3 className="section-title">Input Your Paper</h3>
                            
                            {/* Input Method Selector */}
                            <div className="method-selector">
                                <button
                                    className={`method-btn ${inputMethod === 'file' ? 'active' : ''}`}
                                    onClick={() => setInputMethod('file')}
                                >
                                    📁 Upload File
                                </button>
                                <button
                                    className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
                                    onClick={() => setInputMethod('text')}
                                >
                                    📋 Paste Text
                                </button>
                            </div>

                            {inputMethod === 'file' ? (
                                <div className="file-upload-area">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                        id="paper-file"
                                        className="file-input-hidden"
                                    />
                                    <label htmlFor="paper-file" className="file-upload-label">
                                        <div className="upload-icon">📄</div>
                                        <div className="upload-text">
                                            {paperFile ? (
                                                <>
                                                    <strong>✓ {paperFile.name}</strong>
                                                    <br />
                                                    <small>Click to change file</small>
                                                </>
                                            ) : (
                                                <>
                                                    <strong>Click to upload or drag and drop</strong>
                                                    <br />
                                                    <small>PDF, DOC, DOCX, or TXT (Max 10MB)</small>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className="text-input-area">
                                    <textarea
                                        value={paperText}
                                        onChange={(e) => setPaperText(e.target.value)}
                                        placeholder="Paste your research paper text here..."
                                        className="paper-textarea"
                                        rows="12"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSummarize}
                                disabled={loading || (!paperFile && !paperText.trim())}
                                className="action-btn primary-btn"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <span>🤖</span>
                                        Generate Summary
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="review-panel">
                        <div className="input-section">
                            <h3 className="section-title">Literature Review Parameters</h3>
                            
                            <div className="form-group">
                                <label htmlFor="topic">Research Topic *</label>
                                <input
                                    type="text"
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Machine Learning in Healthcare"
                                    className="text-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="keywords">Keywords (optional)</label>
                                <input
                                    type="text"
                                    id="keywords"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="e.g., AI, diagnosis, patient care"
                                    className="text-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="numPapers">Number of Papers to Review</label>
                                <select
                                    id="numPapers"
                                    value={numPapers}
                                    onChange={(e) => setNumPapers(Number(e.target.value))}
                                    className="select-input"
                                >
                                    <option value={5}>5 Papers</option>
                                    <option value={10}>10 Papers</option>
                                    <option value={15}>15 Papers</option>
                                    <option value={20}>20 Papers</option>
                                    <option value={30}>30 Papers</option>
                                </select>
                            </div>

                            <button
                                onClick={handleGenerateReview}
                                disabled={loading || !topic.trim()}
                                className="action-btn primary-btn"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Generating Review...
                                    </>
                                ) : (
                                    <>
                                        <span>📚</span>
                                        Generate Literature Review
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Results Display */}
                {result && (
                    <div className="results-section">
                        <div className="results-header">
                            <h3>
                                {activeTab === 'summarizer' ? '📝 Paper Summary' : '📚 Literature Review'}
                            </h3>
                            <button onClick={handleExport} className="export-btn">
                                💾 Export Results
                            </button>
                        </div>

                        <div className="results-content">
                            {activeTab === 'summarizer' ? (
                                <>
                                    <div className="result-card">
                                        <h4>Summary</h4>
                                        <p>{result.summary}</p>
                                    </div>

                                    <div className="result-card">
                                        <h4>Key Points</h4>
                                        <ul>
                                            {result.keyPoints.map((point, index) => (
                                                <li key={index}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="result-card">
                                        <h4>Methodology</h4>
                                        <p>{result.methodology}</p>
                                    </div>

                                    <div className="result-card">
                                        <h4>Conclusions</h4>
                                        <p>{result.conclusions}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="result-card">
                                        <h4>Introduction</h4>
                                        <p>{result.introduction}</p>
                                    </div>

                                    <div className="result-card">
                                        <h4>Key Themes</h4>
                                        <ul>
                                            {result.keyThemes.map((theme, index) => (
                                                <li key={index}>{theme}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="result-card">
                                        <h4>Major Findings</h4>
                                        <ul>
                                            {result.majorFindings.map((finding, index) => (
                                                <li key={index}>{finding}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="result-card">
                                        <h4>Research Gaps</h4>
                                        <ul>
                                            {result.researchGaps.map((gap, index) => (
                                                <li key={index}>{gap}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="result-card">
                                        <h4>Recommendations</h4>
                                        <ul>
                                            {result.recommendations.map((rec, index) => (
                                                <li key={index}>{rec}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="result-card">
                                        <h4>Sample References</h4>
                                        <ol className="references-list">
                                            {result.references.map((ref, index) => (
                                                <li key={index}>{ref}</li>
                                            ))}
                                        </ol>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaperSummarizer;

