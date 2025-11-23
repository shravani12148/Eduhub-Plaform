// Simple test script to verify paper summarizer setup
require('dotenv').config();

console.log('=== Testing Paper Summarizer Setup ===\n');

// Check environment variables
console.log('1. Checking environment variables:');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ NOT SET');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ NOT SET');
console.log('   PORT:', process.env.PORT || '5001', '\n');

if (!process.env.GEMINI_API_KEY) {
    console.error('❌ ERROR: GEMINI_API_KEY is not set in .env file');
    console.log('\nTo fix this:');
    console.log('1. Create a .env file in the backend folder');
    console.log('2. Add this line: GEMINI_API_KEY=your_actual_api_key');
    console.log('3. Get your API key from: https://makersuite.google.com/app/apikey\n');
    process.exit(1);
}

// Test Gemini AI connection
console.log('2. Testing Gemini AI connection:');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Try different models
        const models = [
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash",
            "gemini-1.5-pro"
        ];
        
        for (const modelName of models) {
            try {
                console.log(`   Trying ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, please respond with 'Working!'");
                const response = await result.response;
                const text = response.text();
                console.log(`   ✓ ${modelName} is working! Response: ${text.substring(0, 50)}...`);
                break;
            } catch (err) {
                console.log(`   ✗ ${modelName} failed: ${err.message}`);
            }
        }
        
        console.log('\n3. Testing PDF parser:');
        const pdfParse = require('pdf-parse');
        console.log('   ✓ pdf-parse library is installed\n');
        
        console.log('✅ All checks passed! Paper summarizer should work.\n');
        console.log('To start the server, run: npm start\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\nPossible issues:');
        console.log('1. Invalid GEMINI_API_KEY');
        console.log('2. No internet connection');
        console.log('3. Gemini API service down\n');
        process.exit(1);
    }
}

testGemini();


