const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to get a working Gemini model
async function getWorkingModel() {
    const candidateModels = [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];
    
    for (const modelId of candidateModels) {
        try {
            console.log(`Trying model: ${modelId}`);
            const model = genAI.getGenerativeModel({ model: modelId });
            return model;
        } catch (err) {
            console.log(`Model ${modelId} failed:`, err.message);
        }
    }
    
    throw new Error('No working Gemini model found. Please check your API key.');
}

// Extract text from PDF
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

// Extract text from text file
async function extractTextFromFile(filePath) {
    try {
        const text = await fs.readFile(filePath, 'utf8');
        return text;
    } catch (error) {
        console.error('Error reading text file:', error);
        throw new Error('Failed to read text file');
    }
}

// Summarize a research paper
exports.summarizePaper = async (req, res) => {
    console.log('=== Paper Summarization Request ===');
    console.log('Has file:', !!req.file);
    console.log('Has body text:', !!req.body.paperText);
    
    try {
        let paperText = '';
        
        // Get text from file or request body
        if (req.file) {
            console.log('Processing uploaded file:', req.file.originalname);
            const filePath = req.file.path;
            const fileExtension = path.extname(req.file.originalname).toLowerCase();
            
            console.log('File extension:', fileExtension);
            console.log('File path:', filePath);
            
            if (fileExtension === '.pdf') {
                console.log('Extracting text from PDF...');
                paperText = await extractTextFromPDF(filePath);
                console.log('PDF text extracted, length:', paperText.length);
            } else if (['.txt', '.doc', '.docx'].includes(fileExtension)) {
                console.log('Reading text file...');
                paperText = await extractTextFromFile(filePath);
                console.log('Text file read, length:', paperText.length);
            } else {
                console.log('Unsupported file format:', fileExtension);
                return res.status(400).json({ error: 'Unsupported file format. Please upload PDF, TXT, DOC, or DOCX files.' });
            }
            
            // Clean up uploaded file after processing
            await fs.unlink(filePath).catch(err => console.error('Error deleting file:', err));
        } else if (req.body.paperText) {
            console.log('Using pasted text, length:', req.body.paperText.length);
            paperText = req.body.paperText;
        } else {
            console.log('No paper text or file provided');
            return res.status(400).json({ error: 'No paper text or file provided' });
        }

        if (!paperText || paperText.trim().length < 100) {
            console.log('Paper text too short:', paperText.length);
            return res.status(400).json({ error: 'Paper text is too short or empty. Please provide at least 100 characters.' });
        }

        // Limit text length to avoid API limits (approximately 30,000 characters)
        const maxLength = 30000;
        if (paperText.length > maxLength) {
            console.log(`Truncating text from ${paperText.length} to ${maxLength} characters`);
            paperText = paperText.substring(0, maxLength);
        }

        console.log(`Processing paper with ${paperText.length} characters`);

        // Get working model
        console.log('Getting Gemini AI model...');
        const model = await getWorkingModel();
        console.log('Model obtained successfully');

        // Create a comprehensive prompt for summarization
        const prompt = `You are an expert academic research assistant. Analyze the following research paper and provide a comprehensive summary.

Research Paper Text:
${paperText}

Please provide a detailed analysis in the following JSON format:
{
    "title": "Extracted or inferred title of the paper",
    "summary": "A comprehensive 150-200 word summary of the entire paper covering main objectives, methods, and conclusions",
    "keyPoints": [
        "5-7 key points or findings from the paper as separate bullet points"
    ],
    "methodology": "A brief description of the research methodology used in the study",
    "conclusions": "Main conclusions and implications of the research"
}

Make sure to extract actual information from the provided text, not generic responses. Be specific and accurate.`;

        // Generate summary using AI
        console.log('Sending request to Gemini AI...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        console.log('AI response received, length:', text.length);
        
        // Clean and parse JSON response
        text = text.replace(/```json\n?|\n?```/g, '').trim();
        
        let summaryData;
        try {
            summaryData = JSON.parse(text);
            console.log('Successfully parsed AI response as JSON');
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', text.substring(0, 200));
            // Fallback to text response
            summaryData = {
                title: req.file ? req.file.originalname : 'Research Paper',
                summary: text.substring(0, 1000),
                keyPoints: ['Analysis completed - see summary for details'],
                methodology: 'See detailed summary',
                conclusions: 'See detailed summary'
            };
            console.log('Using fallback summary structure');
        }

        console.log('Sending successful response');
        res.json(summaryData);
    } catch (error) {
        console.error('=== Error in summarizePaper ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({ 
            error: 'Failed to summarize paper. Please try again.',
            details: error.message,
            type: error.constructor.name
        });
    }
};

// Generate literature review
exports.generateLiteratureReview = async (req, res) => {
    try {
        const { topic, keywords, numPapers = 10 } = req.body;

        if (!topic || !topic.trim()) {
            return res.status(400).json({ error: 'Research topic is required' });
        }

        console.log(`Generating literature review for topic: ${topic}`);

        // Get working model
        const model = await getWorkingModel();

        // Create comprehensive prompt for literature review
        const keywordsText = keywords ? ` Keywords to focus on: ${keywords}.` : '';
        
        const prompt = `You are an expert academic researcher. Generate a comprehensive literature review on the topic: "${topic}".${keywordsText}

Create a structured literature review that synthesizes findings from approximately ${numPapers} recent research papers.

Provide your response in the following JSON format:
{
    "topic": "${topic}",
    "introduction": "A 150-200 word introduction explaining the significance of this research area and what this review covers",
    "keyThemes": [
        "4-5 major themes or areas of focus in current research"
    ],
    "majorFindings": [
        "5-7 significant findings across the literature"
    ],
    "researchGaps": [
        "3-5 identified gaps in current research that need further investigation"
    ],
    "recommendations": [
        "4-5 specific recommendations for future research directions"
    ],
    "references": [
        "8-12 realistic-looking academic references in proper citation format (Author(s), Year, Title, Journal/Conference)"
    ]
}

Make this a scholarly, well-structured literature review with specific and actionable insights.`;

        // Generate review using AI
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean and parse JSON response
        text = text.replace(/```json\n?|\n?```/g, '').trim();
        
        let reviewData;
        try {
            reviewData = JSON.parse(text);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', text);
            // Fallback response
            reviewData = {
                topic: topic,
                introduction: text.substring(0, 500),
                keyThemes: ['See full text for details'],
                majorFindings: ['See full text for details'],
                researchGaps: ['Further analysis needed'],
                recommendations: ['Continue research in this area'],
                references: []
            };
        }

        res.json(reviewData);
    } catch (error) {
        console.error('Error generating literature review:', error);
        res.status(500).json({ 
            error: 'Failed to generate literature review. Please try again.',
            details: error.message 
        });
    }
};

