# MindFulness Setup Instructions

## Environment Variables Setup

To make the AI chatbot work properly, you need to set up the following environment variables:

### 1. Create .env file in Backend directory

Create a file named `.env` in the `Backend` directory with the following content:

```env
# API Configuration
VITE_API_BASE=http://localhost:4000

# Gemini AI API Key (Get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/mindfulness

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_here
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and replace `your_gemini_api_key_here` in the .env file

### 3. Set up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/mindfulness`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and replace the MONGO_URI in .env

### 4. Start the Application

1. **Start Backend:**
   ```bash
   cd Backend
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### 5. Test the AI Chatbot

1. Open the application in your browser
2. Navigate to the AI Companion page
3. Try sending a message in different languages:
   - English: "I'm feeling anxious"
   - Hindi: "मुझे चिंता हो रही है"
   - Tamil: "நான் கவலைப்படுகிறேன்"
   - Telugu: "నాకు ఆందోళన వస్తోంది"
   - Bengali: "আমি উদ্বিগ্ন বোধ করছি"

## Features Implemented

### ✅ Audio System
- All calming sounds now loop automatically
- Meditation timer has its own bell sound
- Audio files location: `Frontend/public/audio/`

### ✅ Assessment Page
- Complete redesign with test overview
- Individual test selection with descriptions
- Comprehensive results with personalized recommendations
- Professional UI/UX with progress tracking

### ✅ AI Chatbot
- Enhanced multi-language support (English, Hindi, Tamil, Telugu, Bengali)
- Improved intent recognition
- Better fallback responses
- Crisis detection and appropriate responses

### ✅ Self-Help Page
- Removed Daily Wellness section
- Improved meditation timer with 3-minute countdown
- Reorganized layout for better visual hierarchy
- Enhanced counselor's corner with professional recommendations

## Troubleshooting

### AI Chatbot Not Working
1. Check if GEMINI_API_KEY is set correctly in .env
2. Verify the API key is valid and has proper permissions
3. Check browser console for any error messages
4. Ensure backend server is running on port 4000

### Audio Not Playing
1. Check if audio files exist in `Frontend/public/audio/`
2. Ensure files are in MP3 format
3. Check browser audio permissions

### Assessment Page Issues
1. Clear browser cache and refresh
2. Check for JavaScript errors in console
3. Ensure all CSS files are loaded properly

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure both frontend and backend servers are running
4. Check network connectivity for API calls
