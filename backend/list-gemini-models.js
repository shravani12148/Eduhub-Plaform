// List available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    console.log('🔍 Listing available Gemini models...\n');
    
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY is not set');
        process.exit(1);
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        // Try to list models
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('✅ Available models:\n');
        
        if (data.models && data.models.length > 0) {
            data.models.forEach((model, index) => {
                console.log(`${index + 1}. ${model.name}`);
                if (model.displayName) {
                    console.log(`   Display Name: ${model.displayName}`);
                }
                if (model.supportedGenerationMethods) {
                    console.log(`   Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
                }
                console.log('');
            });
            
            // Find models that support generateContent
            const contentModels = data.models.filter(m => 
                m.supportedGenerationMethods && 
                m.supportedGenerationMethods.includes('generateContent')
            );
            
            if (contentModels.length > 0) {
                console.log('\n✅ Models that support generateContent:\n');
                contentModels.forEach(model => {
                    const modelId = model.name.replace('models/', '');
                    console.log(`   • ${modelId}`);
                });
                
                // Test the first available model
                console.log('\n🧪 Testing the first available model...\n');
                const testModelId = contentModels[0].name.replace('models/', '');
                const testModel = genAI.getGenerativeModel({ model: testModelId });
                const result = await testModel.generateContent("Say hello");
                const response = await result.response;
                const text = response.text();
                
                console.log(`✅ ${testModelId} works!`);
                console.log(`   Response: ${text}\n`);
                
                console.log('=' .repeat(60));
                console.log(`\n✅ Use this model in your code: "${testModelId}"`);
                console.log('=' .repeat(60) + '\n');
            }
        } else {
            console.log('❌ No models found');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        // Try alternative approach
        console.log('\n🔄 Trying alternative method...\n');
        
        const modelsToTry = [
            'gemini-pro',
            'gemini-1.0-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'models/gemini-pro',
            'models/gemini-1.0-pro'
        ];
        
        for (const modelId of modelsToTry) {
            try {
                console.log(`Testing: ${modelId}...`);
                const model = genAI.getGenerativeModel({ model: modelId });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                const text = response.text();
                
                console.log(`✅ ${modelId} WORKS!`);
                console.log(`   Response: ${text.substring(0, 50)}...\n`);
                console.log('=' .repeat(60));
                console.log(`\n✅ Use this model: "${modelId}"`);
                console.log('=' .repeat(60) + '\n');
                return;
            } catch (err) {
                console.log(`❌ ${modelId} failed: ${err.message.substring(0, 100)}...`);
            }
        }
        
        console.log('\n❌ No working models found.');
        console.log('\n💡 Your API key might need to be regenerated.');
        console.log('   Visit: https://makersuite.google.com/app/apikey\n');
    }
}

listModels().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
});

