import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="logo">
                        <h2>EduPlatform</h2>
                    </div>
                    <div className="nav-center">
                        <a href="#home" className="nav-link">Home</a>
                        <a href="#about" className="nav-link">About</a>
                        <a href="#contact" className="nav-link">Contact Us</a>
                    </div>
                    <div className="nav-right">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link primary">Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Welcome to Your Learning Journey</h1>
                        <p>Join thousands of students and professionals advancing their careers with our comprehensive learning platform.</p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary">
                                Get Started Free
                            </Link>
                            <Link to="/login" className="btn btn-secondary">
                                Sign In
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-visual">
                            <div className="image-placeholder">
                                <div className="learning-illustration">
                                    <div className="book"></div>
                                    <div className="laptop"></div>
                                    <div className="graduation-cap"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose Our Platform?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📖</div>
                            <h3>Comprehensive Curriculum</h3>
                            <p>Access a wide range of courses tailored for students, undergraduates, and postgraduates.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">👨‍🏫</div>
                            <h3>Expert Instructors</h3>
                            <p>Learn from industry professionals and academic experts with real-world experience.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Career Advancement</h3>
                            <p>Gain skills that directly translate to career growth and academic success.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container">
                    <div className="about-content-single">
                        <h2>About EduPlatform</h2>
                        <p className="about-intro">
                            EduPlatform is a comprehensive educational platform designed to empower students, 
                            undergraduates, and postgraduates with cutting-edge learning tools and resources.
                        </p>
                        <div className="about-features">
                            <div className="about-feature-item">
                                <div className="about-icon">🎯</div>
                                <div>
                                    <h4>Our Mission</h4>
                                    <p>To provide accessible, high-quality education and career guidance to learners worldwide.</p>
                                </div>
                            </div>
                            <div className="about-feature-item">
                                <div className="about-icon">💡</div>
                                <div>
                                    <h4>Our Vision</h4>
                                    <p>To become the leading platform for AI-powered learning and career development.</p>
                                </div>
                            </div>
                            <div className="about-feature-item">
                                <div className="about-icon">🤝</div>
                                <div>
                                    <h4>Our Values</h4>
                                    <p>Innovation, accessibility, excellence, and student success drive everything we do.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="container">
                    <h2>Get In Touch</h2>
                    <p className="contact-subtitle">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="contact-icon">📧</div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p>support@eduplatform.com</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">📞</div>
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">📍</div>
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>123 Education Street, Learning City, LC 12345</p>
                                </div>
                            </div>
                        </div>
                        <div className="contact-form-wrapper">
                            <form className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" placeholder="Enter your name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" placeholder="Enter your email" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input type="text" id="subject" placeholder="What is this about?" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" rows="5" placeholder="Write your message here..." required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-full">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join our community of learners today and take the first step towards your goals.</p>
                    <Link to="/register" className="btn btn-large">
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 EduPlatform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;