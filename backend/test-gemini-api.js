// Test script to verify Gemini API key
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
    console.log('🔍 Testing Gemini API Configuration...\n');
    
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY is not set in .env file');
        console.log('\n📝 To fix this:');
        console.log('1. Open backend/.env file');
        console.log('2. Add: GEMINI_API_KEY=your_api_key_here');
        console.log('3. Get API key from: https://makersuite.google.com/app/apikey');
        process.exit(1);
    }
    
    console.log('✅ GEMINI_API_KEY is set');
    console.log(`   Key preview: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Test different models
    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
    ];
    
    console.log('\n🧪 Testing available models...\n');
    
    let workingModel = null;
    
    for (const modelId of modelsToTest) {
        try {
            console.log(`Testing ${modelId}...`);
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            const text = response.text();
            
            console.log(`✅ ${modelId} works!`);
            console.log(`   Response: ${text.substring(0, 50)}...`);
            
            if (!workingModel) {
                workingModel = modelId;
            }
        } catch (error) {
            console.log(`❌ ${modelId} failed:`, error.message);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (workingModel) {
        console.log(`\n✅ SUCCESS! Your Gemini API is working!`);
        console.log(`   Best model: ${workingModel}`);
        console.log('\n🎉 Your AI Assistant should work now!');
        console.log('   Restart your backend server to apply changes.');
    } else {
        console.log(`\n❌ FAILED! None of the models work.`);
        console.log('\n🔧 Possible issues:');
        console.log('   1. Invalid API key');
        console.log('   2. API key doesn\'t have access to Gemini models');
        console.log('   3. Rate limit exceeded');
        console.log('   4. Network connectivity issues');
        console.log('\n💡 Solution:');
        console.log('   1. Get a new API key from: https://makersuite.google.com/app/apikey');
        console.log('   2. Make sure you\'re using the "Gemini API" (not other Google APIs)');
        console.log('   3. Update your .env file with the new key');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
}

testGeminiAPI().catch(error => {
    console.error('\n❌ Test failed with error:', error.message);
    process.exit(1);
});

