const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { summarizePaper, generateLiteratureReview } = require('../controllers/paperSummarizerController');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/papers');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'paper-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['.pdf', '.txt', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, TXT, DOC, and DOCX files are allowed'));
        }
    }
});

// Test route to verify the API is working
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Paper Summarizer API is working!',
        timestamp: new Date().toISOString()
    });
});

// Route to summarize a paper
router.post('/summarize', upload.single('paper'), summarizePaper);

// Route to generate literature review
router.post('/literature-review', generateLiteratureReview);

module.exports = router;

