# Paper Summarizer Troubleshooting Guide

## ✅ Status: Backend Setup is WORKING

The test shows that:
- ✓ Gemini API Key is configured correctly
- ✓ AI Model (gemini-2.0-flash-exp) is responding
- ✓ PDF parser is installed

## 🔍 How to Debug the Issue

### Step 1: Check if Backend Server is Running

Open a terminal in the `backend` folder and run:
```bash
npm start
```

You should see:
```
Server is running on port 5001
MongoDB connected successfully
GEMINI_API_KEY: Set
```

### Step 2: Test the API Endpoint

Open your browser and go to:
```
http://localhost:5001/api/paper-summarizer/test
```

You should see:
```json
{
  "message": "Paper Summarizer API is working!",
  "timestamp": "2025-..."
}
```

If this works, the backend route is configured correctly.

### Step 3: Check Browser Console for Errors

1. Open the Paper Summarizer page in your browser
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Try to summarize a paper
5. Look for error messages

Common errors and solutions:

#### Error: "Network Error" or "Cannot connect to server"
**Solution:** Backend server is not running. Start it with `npm start` in the backend folder.

#### Error: "Request timeout"
**Solution:** The paper is too long or processing is slow. Try:
- Use shorter text (under 10,000 words)
- Wait longer (AI processing can take 30-60 seconds for long papers)

#### Error: "Paper text is too short"
**Solution:** Make sure your paper has at least 100 characters.

#### Error: 500 Internal Server Error
**Solution:** Check the backend terminal for detailed error logs.

### Step 4: Test with Simple Text First

Instead of uploading a file, try using the "Paste Text" option with this sample text:

```
Title: The Impact of Artificial Intelligence on Healthcare

Abstract: This study examines how artificial intelligence technologies are transforming modern healthcare systems. We analyzed 100 case studies across different medical facilities and found that AI-powered diagnostic tools improved accuracy by 25% while reducing processing time by 40%. The research methodology involved both quantitative analysis of patient outcomes and qualitative interviews with healthcare professionals. Our findings suggest that while AI integration presents significant benefits, challenges remain in terms of implementation costs and staff training. We conclude that strategic adoption of AI technologies can substantially improve patient care quality and operational efficiency in healthcare settings.

Introduction: Artificial intelligence (AI) has emerged as a transformative force in healthcare...
[Add more text here - the longer the better for testing]
```

### Step 5: Check File Format

If uploading files doesn't work:
- ✓ Supported formats: PDF, TXT, DOC, DOCX
- ✓ Maximum size: 10MB
- Try converting your PDF to TXT first
- Make sure the PDF contains actual text (not scanned images)

### Step 6: Monitor Backend Logs

When you try to summarize, watch the backend terminal. You should see:
```
=== Paper Summarization Request ===
Has file: true
Processing uploaded file: paper.pdf
File extension: .pdf
Extracting text from PDF...
PDF text extracted, length: 5234
Processing paper with 5234 characters
Getting Gemini AI model...
Model obtained successfully
Sending request to Gemini AI...
AI response received, length: 892
Successfully parsed AI response as JSON
Sending successful response
```

If you see errors in these logs, they will tell you exactly what's wrong.

### Step 7: Restart Both Servers

Sometimes a simple restart fixes issues:

1. Stop both frontend and backend servers (Ctrl+C)
2. Restart backend:
   ```bash
   cd backend
   npm start
   ```
3. Restart frontend:
   ```bash
   cd frontend
   npm run dev
   ```
4. Try again

## 🎯 Quick Test Checklist

- [ ] Backend server is running on port 5001
- [ ] Test endpoint works: http://localhost:5001/api/paper-summarizer/test
- [ ] Frontend is running (usually port 5173)
- [ ] Browser console shows no errors
- [ ] Tested with simple pasted text (not just file upload)
- [ ] Paper has at least 100 characters
- [ ] File is under 10MB

## 📝 Still Not Working?

If you've checked all the above and it's still not working, provide these details:

1. **Error message from browser console** (exact text)
2. **Backend terminal logs** (when you try to summarize)
3. **What type of input** you're using (file upload or pasted text)
4. **File size** (if uploading a file)

## 💡 Common Solutions

### Solution 1: CORS Issue
If you see CORS errors, make sure in `backend/server.js`:
```javascript
app.use(cors());
```

### Solution 2: Port Conflict
If port 5001 is already in use:
1. Change PORT in backend/.env to 5002
2. Update frontend/src/api.js baseURL to http://localhost:5002/api

### Solution 3: Gemini API Quota
If you're getting errors about quota:
- Check your Gemini API usage at https://makersuite.google.com/
- You might have hit the free tier limit
- Wait an hour or upgrade your plan

## 🚀 Expected Behavior

When working correctly:
1. Upload/paste paper (1-2 seconds)
2. "Analyzing..." message appears
3. Processing takes 20-60 seconds depending on paper length
4. Summary appears with:
   - Title
   - Summary (150-200 words)
   - Key Points (5-7 items)
   - Methodology
   - Conclusions

Good luck! 🎉


