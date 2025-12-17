const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Please create a .env file in the backend directory with the required variables.');
    process.exit(1);
}

// Debug environment variables
console.log('✅ Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set (optional)');
console.log('YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? 'Set' : 'Not set (optional)');
console.log('PORT:', process.env.PORT || 5001);

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable for development, enable in production
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/register attempts per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// CORS
app.use(cors());

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Function to seed data after MongoDB connection
async function seedData() {
    try {
        const Course = require('./models/Course');
        const Internship = require('./models/Internship');
        
        console.log('Seeding courses...');
        await Course.seed();
        
        console.log('Seeding internships...');
        await Internship.seed();
        
        console.log('Data seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

// Connect to MongoDB with better timeout settings and retry logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB connected successfully');
        // Seed data after connection is established
        await seedData();
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️  Server will continue without database connection');
        console.log('💡 Tip: Make sure MongoDB is running or check your MONGO_URI in .env file');
    }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

// Health check endpoint
app.get('/health', (req, res) => {
    const healthStatus = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        environment: {
            nodeEnv: process.env.NODE_ENV || 'development',
            port: PORT,
            geminiApiKey: process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured',
            youtubeApiKey: process.env.YOUTUBE_API_KEY ? 'Configured' : 'Not configured'
        }
    };
    res.json(healthStatus);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ai-quiz', require('./routes/aiQuiz'));
app.use('/api/ai-assistant', require('./routes/aiAssistant'));
app.use('/api/ai/voice-interview', require('./routes/voiceInterview'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/plagiarism', require('./routes/plagiarism'));
app.use('/api/career-path', require('./routes/careerPath'));
app.use('/api/paper-summarizer', require('./routes/paperSummarizer'));
app.use('/api/admin', require('./routes/admin'));

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found',
        path: req.path 
    });
});

// Global error handler - must be last
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(async () => {
        console.log('HTTP server closed');
        
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    gracefulShutdown('unhandledRejection');
});