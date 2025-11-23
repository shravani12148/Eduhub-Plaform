import React, { useState } from 'react';
import './BooksSection.css';

const BooksSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [error, setError] = useState('');

    const categories = [
        { key: 'all', label: 'All Books', icon: '📚' },
        { key: 'science', label: 'Science', icon: '🔬' },
        { key: 'technology', label: 'Technology', icon: '💻' },
        { key: 'mathematics', label: 'Mathematics', icon: '📐' },
        { key: 'literature', label: 'Literature', icon: '📖' },
        { key: 'history', label: 'History', icon: '🏛️' },
        { key: 'business', label: 'Business', icon: '💼' }
    ];

    const searchBooks = async (query, category = 'all') => {
        if (!query.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // Construct search query with category
            let searchTerm = query;
            if (category !== 'all') {
                searchTerm = `${query}+subject:${category}`;
            }

            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=20&key=AIzaSyD1BIpRBtILk_f3Amaes_EMqIzTHa2LRZ8`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                setBooks(data.items);
            } else {
                setBooks([]);
                setError('No books found. Try a different search term.');
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('Failed to fetch books. Please try again.');
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchBooks(searchQuery, selectedCategory);
    };

    const handleCategoryClick = (categoryKey) => {
        setSelectedCategory(categoryKey);
        if (searchQuery.trim()) {
            searchBooks(searchQuery, categoryKey);
        }
    };

    const handleQuickSearch = (topic) => {
        setSearchQuery(topic);
        searchBooks(topic, selectedCategory);
    };

    const quickSearchTopics = [
        'Computer Science',
        'Physics',
        'Chemistry',
        'Biology',
        'Mathematics',
        'Engineering',
        'Programming',
        'Data Science'
    ];

    return (
        <div className="books-section">
            {/* Header */}
            <div className="books-header">
                <div className="books-header-content">
                    <div className="books-badge">
                        <span className="badge-icon">📚</span>
                        <span className="badge-text">Google Books Library</span>
                    </div>
                    <h1 className="books-title">Discover Educational Books</h1>
                    <p className="books-subtitle">Access millions of books from Google Books Library to enhance your learning</p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
                <h3 className="filter-title">Browse by Category</h3>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.key)}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-label">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Section */}
            <div className="books-search-container">
                <form onSubmit={handleSearch} className="books-search-form">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for books by title, author, or subject..."
                            className="books-search-input"
                        />
                        <button 
                            type="submit" 
                            className="search-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Searching...
                                </>
                            ) : (
                                'Search Books'
                            )}
                        </button>
                    </div>
                </form>

                {/* Quick Search Topics */}
                <div className="quick-search-section">
                    <p className="quick-search-label">Popular Topics:</p>
                    <div className="quick-search-tags">
                        {quickSearchTopics.map((topic, index) => (
                            <button
                                key={index}
                                className="quick-search-tag"
                                onClick={() => handleQuickSearch(topic)}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="loading-container">
                    <div className="spinner-large"></div>
                    <p>Searching for books...</p>
                </div>
            )}

            {/* Books Grid */}
            {!loading && books.length > 0 && (
                <div className="books-results">
                    <div className="results-header">
                        <h2 className="results-title">Search Results</h2>
                        <p className="results-count">{books.length} books found</p>
                    </div>
                    <div className="books-grid">
                        {books.map((book) => {
                            const bookInfo = book.volumeInfo;
                            const thumbnail = bookInfo.imageLinks?.thumbnail || bookInfo.imageLinks?.smallThumbnail;
                            
                            return (
                                <div key={book.id} className="book-card">
                                    <div className="book-cover">
                                        {thumbnail ? (
                                            <img src={thumbnail} alt={bookInfo.title} />
                                        ) : (
                                            <div className="book-cover-placeholder">
                                                <span className="placeholder-icon">📖</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="book-details">
                                        <h3 className="book-title">{bookInfo.title}</h3>
                                        {bookInfo.authors && (
                                            <p className="book-authors">
                                                by {bookInfo.authors.join(', ')}
                                            </p>
                                        )}
                                        {bookInfo.publishedDate && (
                                            <p className="book-date">
                                                Published: {bookInfo.publishedDate}
                                            </p>
                                        )}
                                        {bookInfo.description && (
                                            <p className="book-description">
                                                {bookInfo.description.substring(0, 150)}
                                                {bookInfo.description.length > 150 ? '...' : ''}
                                            </p>
                                        )}
                                        <div className="book-actions">
                                            {bookInfo.previewLink && (
                                                <a
                                                    href={bookInfo.previewLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="book-btn book-btn-preview"
                                                >
                                                    Preview
                                                </a>
                                            )}
                                            {bookInfo.infoLink && (
                                                <a
                                                    href={bookInfo.infoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="book-btn book-btn-info"
                                                >
                                                    More Info
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && books.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3>Start Your Book Search</h3>
                    <p>Search for educational books or click on a category to explore</p>
                </div>
            )}
        </div>
    );
};

export default BooksSection;

