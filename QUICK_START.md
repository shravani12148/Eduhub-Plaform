# Career Path Module - Quick Start Guide

## 🚀 Getting Started

### For Students

1. **Log in** to your student account
2. Navigate to **UG Dashboard**
3. Click **"Career Path"** in the sidebar menu OR click the Career Path action card
4. Fill in your profile:
   - Select your **Field of Study**
   - Enter your **CGPA** (0-10)
   - Choose your **Preferred Country**
5. Click **"Get Personalized Recommendations"**
6. Explore the results:
   - **Click cards** to see detailed information
   - **Add programs** to compare (up to 3)
   - **View roadmap** for step-by-step guidance
   - **Check scholarships** available for you

### For Developers

#### Setup
```bash
# Ensure GEMINI_API_KEY is set in .env
GEMINI_API_KEY=your_api_key_here

# Install dependencies (if needed)
cd backend
npm install @google/generative-ai
```

#### File Locations
- **Frontend:** `frontend/src/components/CareerPathModule.jsx`
- **Backend Controller:** `backend/controllers/careerPathController.js`
- **Backend Routes:** `backend/routes/careerPath.js`
- **API Endpoint:** `POST /api/career-path/recommendations`

#### Testing
```bash
# Test API with curl
curl -X POST http://localhost:5001/api/career-path/recommendations \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "field": "Engineering",
    "cgpa": 8.5,
    "preferredCountry": "USA"
  }'
```

---

## 📱 Features at a Glance

| Feature | Description |
|---------|-------------|
| **Field Selection** | Choose from 7 fields of study |
| **CGPA Input** | Enter your academic performance |
| **Country Selection** | 8 destinations to choose from |
| **AI Recommendations** | Powered by Google Gemini AI |
| **Program Cards** | Expandable details for each program |
| **Comparison** | Compare up to 3 programs side-by-side |
| **Roadmap** | 7-step journey to course start |
| **Scholarships** | Browse available funding options |

---

## 🎯 Supported Options

### Fields
- Engineering
- Commerce
- Science
- Arts
- Management

### Countries
- India
- USA
- UK
- Canada
- Australia
- Germany
- Netherlands
- Singapore

### Programs
- M.Tech / MS / Ph.D (Engineering)
- MBA / M.Com / MS Finance / Ph.D (Commerce)
- M.Sc / MS / Ph.D (Science)
- M.A / MS / Ph.D (Arts)
- MBA / MS Management / Ph.D (Management)

---

## 🔑 Key Components

```
Career Path Module
├── Input Section
│   ├── Field dropdown
│   ├── CGPA input
│   ├── Country selector
│   └── Get Recommendations button
├── Results Section
│   ├── Program Cards (expandable)
│   ├── Comparison View
│   ├── Roadmap Timeline
│   └── Scholarships Grid
└── Error Handling
    ├── Validation errors
    ├── API failures
    └── User feedback
```

---

## 🛠️ Common Tasks

### How to Add a New Field?
1. Open `careerPathController.js`
2. Add to `careerDatabase` object:
```javascript
NewField: {
    programs: ['Program1', 'Program2'],
    exams: ['Exam1', 'Exam2'],
    topUniversities: { /* ... */ },
    estimatedCost: { /* ... */ },
    scholarships: [ /* ... */ ],
    careerProspects: [ /* ... */ ],
    eligibility: "..."
}
```
3. Update frontend field dropdown in `CareerPathModule.jsx`

### How to Add a New Country?
1. Open `careerPathController.js`
2. Add country to each field's `topUniversities` and `estimatedCost`
3. Update frontend countries array in `CareerPathModule.jsx`

### How to Customize AI Prompts?
Edit the prompt in `careerPathController.js` `getRecommendations()` function:
```javascript
const prompt = `Your custom prompt here...`;
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to generate recommendations" | Check GEMINI_API_KEY is set |
| Recommendations not loading | Verify backend is running |
| Comparison not working | Ensure you've selected programs |
| Mobile layout broken | Check screen size, use browser DevTools |
| Cards not expanding | Clear browser cache and refresh |

---

## 📊 API Response Example

```json
{
  "success": true,
  "data": {
    "field": "Engineering",
    "cgpa": 8.5,
    "preferredCountry": "USA",
    "programs": ["M.Tech", "MS", "Ph.D"],
    "requiredExams": ["GATE", "GRE", "TOEFL", "IELTS"],
    "topUniversities": [
      "MIT",
      "Stanford",
      "Carnegie Mellon",
      "UC Berkeley"
    ],
    "estimatedCost": "$30,000-60,000 per year",
    "scholarships": ["Fulbright", "Erasmus Mundus"],
    "careerProspects": [
      "Software Engineer",
      "Data Scientist"
    ],
    "roadmap": [
      {
        "step": 1,
        "title": "Prepare for Entrance Exam",
        "duration": "3-6 months",
        "description": "Study and prepare for GATE, CAT, GMAT, or GRE"
      },
      /* ... more steps ... */
    ]
  }
}
```

---

## ✅ Checklist for Deployment

- [ ] GEMINI_API_KEY environment variable set
- [ ] All files created and integrated
- [ ] Backend route mounted in server.js
- [ ] Frontend component imported in UG_Dashboard
- [ ] Sidebar menu item added
- [ ] CSS file imported
- [ ] No linter errors
- [ ] API tested with sample data
- [ ] Mobile responsiveness verified
- [ ] Error handling tested
- [ ] Documentation reviewed

---

## 📞 Quick Links

- **Full Documentation:** `CAREER_PATH_MODULE.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **GitHub Issues:** Check repository
- **API Docs:** Inside `CAREER_PATH_MODULE.md`

---

## 💡 Tips & Tricks

1. **Filter by CGPA:** Higher CGPA recommendations generally include top-tier universities
2. **Cost Planning:** Germany and Netherlands offer affordable education
3. **Scholarships:** Check country-specific scholarships for better funding
4. **Career Planning:** Use comparison feature to analyze different options
5. **Timeline:** Plan at least 6 months before application deadline

---

**Last Updated:** October 2025
**Version:** 1.0.0
**Status:** Production Ready ✅

