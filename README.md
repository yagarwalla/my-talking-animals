# My Talking Animals

A React Progressive Web App (PWA) that creates an interactive farm experience where children can learn animal names in multiple languages through AI-generated speech and animations.

## ⚡ Quick Start

```bash
# Clone and setup
git clone https://github.com/yagarwalla/my-talking-animals.git
cd my-talking-animals

# Install dependencies
npm install

# Start the server (using NVM - recommended)
source ~/.nvm/nvm.sh && nvm use 18.20.8 && npm start

# Open http://localhost:3000 in your browser
```

**Note**: If you get "command not found: npm" error, see the [Troubleshooting](#-troubleshooting-server-issues) section below.

## 🌟 Features

- **Interactive Farm Map**: Clickable areas with animated overlays
- **AI-Powered Animal Voices**: GPT-4o-mini generates bilingual introductions
- **Azure OpenAI TTS**: High-quality text-to-speech with animal-specific playback rates
- **Profile Management**: Create, select, and manage multiple child profiles
- **Bilingual Learning**: Primary and secondary language support (English/Hindi)
- **Talking Animations**: Realistic mouth movements synchronized with speech
- **Responsive Design**: Optimized for all device sizes
- **PWA Ready**: Installable on mobile devices

## 🏗️ Architecture

**Frontend Only**: This is a client-side React application with no separate backend server.

- **Frontend**: React.js with modern hooks and components
- **AI Services**: Azure OpenAI (GPT + TTS) via API calls
- **Storage**: Browser localStorage for user profiles
- **Audio**: Web Audio API for effects, HTML5 Audio for playback
- **Styling**: CSS with Framer Motion animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher) - **Required**
- npm or yarn
- Azure OpenAI Service account (optional for basic functionality)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yagarwalla/my-talking-animals.git
cd my-talking-animals
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables (optional):**
```bash
cp .env.example .env
# Edit .env with your Azure OpenAI credentials
```

### 🖥️ Running the Development Server

#### Method 1: Using NVM (Recommended)
**This is the recommended method** as it ensures you're using the correct Node.js version:

```bash
# 1. Activate NVM and check if it's working
source ~/.nvm/nvm.sh
nvm --version

# 2. Install Node.js v18.20.8 (if not already installed)
nvm install 18.20.8

# 3. Use the correct Node.js version
nvm use 18.20.8

# 4. Verify Node.js and npm are working
node --version  # Should show v18.20.8
npm --version   # Should show v10.8.2

# 5. Start the development server
npm start
```

#### Method 2: Direct Node.js (If already installed)
If Node.js is already installed globally and in your PATH:

```bash
# Check Node.js version (should be v18 or higher)
node --version

# Check npm version
npm --version

# Start the development server
npm start
```

#### Method 3: Using Yarn
If you prefer Yarn and have it installed:

```bash
# Check Yarn version
yarn --version

# Install dependencies
yarn install

# Start the development server
yarn start
```

### 🌐 Access the Application

Once the server starts successfully:
- Open your browser and go to [http://localhost:3000](http://localhost:3000)
- The application should load with the profile selector screen

### 🔧 Troubleshooting Server Issues

#### Issue: "command not found: npm" or "command not found: node"
**Solution:** Node.js is not installed or not in your PATH.

**Step 1: Check if NVM is installed**
```bash
# Check if NVM directory exists
ls -la ~/.nvm

# If NVM exists, activate it
source ~/.nvm/nvm.sh
nvm --version
```

**Step 2A: If NVM is installed (Recommended)**
```bash
# Activate NVM
source ~/.nvm/nvm.sh

# Install Node.js v18.20.8
nvm install 18.20.8

# Use the installed version
nvm use 18.20.8

# Verify installation
node --version  # Should show v18.20.8
npm --version   # Should show v10.8.2

# Now start the server
npm start
```

**Step 2B: If NVM is not installed, install it first**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source NVM
source ~/.nvm/nvm.sh

# Install and use Node.js v18
nvm install 18.20.8
nvm use 18.20.8

# Verify installation
node --version
npm --version
```

**Step 2C: Alternative - Install Node.js directly (macOS with Homebrew)**
```bash
# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

#### Issue: "localhost refused to connect"
**Solution:** The development server isn't running properly.

1. **Check if the server is running:**
```bash
# Check for running processes
ps aux | grep "npm start" | grep -v grep

# Check if port 3000 is in use
lsof -i :3000
```

2. **Kill any existing processes:**
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Kill any npm processes
pkill -f "npm start"
```

3. **Restart the server:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start the server (using NVM)
source ~/.nvm/nvm.sh && nvm use 18.20.8 && npm start
```

#### Issue: "NVM command not found" after installation
**Solution:** NVM needs to be sourced in your shell profile.

```bash
# Add NVM to your shell profile
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc

# Reload your shell profile
source ~/.zshrc

# Now try again
nvm --version
```

#### Issue: "Module not found" errors
**Solution:** Dependencies are missing or corrupted.

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install

# If using Yarn
rm -rf node_modules yarn.lock
yarn install
```

#### Issue: Server starts but shows "Compiled successfully!" but browser shows errors
**Solution:** This usually means the server is running but there are JavaScript errors.

1. **Check browser console for errors:**
   - Open browser developer tools (F12)
   - Go to Console tab
   - Look for red error messages

2. **Common fixes:**
```bash
# Clear browser cache and restart
# In browser: Ctrl+Shift+R (hard refresh)

# Or restart the server
source ~/.nvm/nvm.sh && nvm use 18.20.8 && npm start
```

#### Issue: "Port 3000 is already in use"
**Solution:** Another process is using port 3000.

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

#### Issue: "Permission denied" errors
**Solution:** Fix npm permissions.

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use a Node version manager like NVM
```

### 📱 Development Tips

- **Hot Reload:** The server automatically reloads when you make changes
- **Console Logs:** Check browser console for debugging information
- **Network Tab:** Monitor API calls and responses
- **Mobile Testing:** Use browser dev tools to test mobile responsiveness

## 📁 Project Structure

```
my-talking-animals/
├── public/
│   ├── config/
│   │   └── farm.json              # Animal configurations and positions
│   ├── maps/
│   │   └── landscape-map.jpg      # Interactive farm map background
│   ├── animals/                   # Animal sprites and sounds
│   │   ├── cow/
│   │   │   ├── cow_idle.png
│   │   │   ├── cow_openmouth.png
│   │   │   ├── moo.mp3
│   │   │   └── voice_en.mp3
│   │   ├── pig/
│   │   ├── goat/
│   │   ├── sheep/
│   │   ├── hen/
│   │   └── horse/
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── components/
│   │   ├── ProfileSelector.jsx    # Profile creation and management
│   │   ├── MapScreen.jsx          # Interactive farm map
│   │   ├── AreaScreen.jsx         # Farm area with animals
│   │   ├── Animal.jsx             # Individual animal component
│   │   ├── AnimalCard.jsx         # Demo animal component
│   │   └── AnimalDemo.jsx         # Demo page
│   ├── utils/
│   │   ├── generateAnimalSpeech.js    # GPT + TTS integration
│   │   └── audioEffects.js            # Audio playback rate effects
│   ├── App.jsx                    # Main app with routing
│   ├── index.css                  # Global styles and animations
│   └── index.js                   # App entry point
├── .env.example                   # Environment variables template
├── package.json
└── README.md
```

## 🎯 Core Features

### 1. Profile Management
- **Create Profiles**: Set child name, primary/secondary languages
- **Profile Selection**: Choose from multiple saved profiles
- **Language Support**: English and Hindi combinations
- **Persistent Storage**: Profiles saved in browser localStorage

### 2. Interactive Farm Map
- **Clickable Areas**: Farm, Forest, Lake, Mountain
- **Animated Overlays**: Trees, mountains, forest, lake with Framer Motion
- **Responsive Design**: Adapts to different screen sizes
- **Navigation**: Seamless routing between areas

### 3. AI-Powered Animal Voices
- **GPT-4o-mini**: Generates bilingual animal introductions
- **Azure TTS**: High-quality speech synthesis
- **Bilingual Content**: Example: "Hi there, I am a cow, I like eating grass. I am called gaye in Hindi. Can you say gaye in Hindi?"
- **Language Learning**: Teaches animal names in secondary language

### 4. Talking Animations
- **Sprite Cycling**: Alternates between idle and talking sprites
- **Synchronized Timing**: Animation matches speech duration
- **Natural Rhythm**: 1.2s talking, 0.8s idle (2s total cycle)
- **Visual Feedback**: Sparkle effects on click

### 5. Audio Effects System
- **Playback Rate Adjustments**: Each animal has unique voice characteristics
- **Lightweight Processing**: No complex DSP, just HTML5 Audio
- **Animal Configurations**:
  - Cow: 0.85x (slower, deeper)
  - Pig: 0.9x (slightly slower)
  - Goat: 1.2x (faster, higher)
  - Sheep: 0.95x (gentle)
  - Hen: 1.4x (fast, chirpy)
  - Horse: 0.9x (majestic)

## 🔧 Configuration

### Environment Variables (.env)
```bash
REACT_APP_AZURE_AI_FOUNDRY_KEY=your_azure_openai_api_key
REACT_APP_GPT_ENDPOINT=https://your-resource.openai.azure.com/openai/deployments/gpt-4o-mini
REACT_APP_TTS_ENDPOINT=https://your-resource.openai.azure.com/openai/deployments/gpt-4o-mini-tts
```

### Farm Configuration (public/config/farm.json)
```json
{
  "background": "farm-background.png",
  "animals": [
    {
      "id": "cow",
      "name": { "en": "Cow", "hi": "गाय" },
      "spriteIdle": "animals/cow/cow_idle.png",
      "spriteTalking": "animals/cow/cow_openmouth.png",
      "sound": "animals/cow/moo.mp3",
      "voice": "animals/cow/voice_en.mp3",
      "position": { "x": "15%", "y": "60%" }
    }
  ]
}
```

## 🎮 User Experience Flow

1. **Profile Setup**: Create child profile with language preferences
2. **Map Navigation**: Explore interactive farm map
3. **Area Selection**: Click on farm area to enter
4. **Animal Interaction**: Click animals to hear AI-generated introductions
5. **Language Learning**: Learn animal names in secondary language
6. **Visual Feedback**: Watch talking animations and sparkle effects

## 🛠️ Technical Implementation

### Audio Processing Pipeline
1. **User Click** → Animal sound plays immediately
2. **GPT Generation** → Bilingual introduction text
3. **Azure TTS** → High-quality speech audio
4. **Playback Rate** → Animal-specific speed adjustment
5. **Animation Sync** → Talking animation matches audio duration

### State Management
- **React Hooks**: useState, useEffect for component state
- **Local Storage**: Profile persistence
- **React Router**: Navigation and routing
- **Framer Motion**: Animations and transitions

### Performance Optimizations
- **Audio Preloading**: Howler.js for sound effects
- **Image Optimization**: PNG sprites with transparent backgrounds
- **Lazy Loading**: Components load on demand
- **Efficient Rendering**: React.memo and optimized re-renders

## 🌐 Browser Support

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

**Note**: Web Audio API requires user interaction before playing audio.

## 🚀 Deployment

### Local Build
```bash
npm run build
```

### Azure Static Web Apps Deployment

This React PWA is optimized for deployment on Azure Static Web Apps:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Azure Portal**:
   - Go to Azure Portal → Static Web Apps
   - Create new Static Web App
   - Connect to your GitHub repository
   - Configure build settings:
     - **App location**: `/` (root of repository)
     - **Output location**: `build`
     - **Build command**: `npm run build`

3. **Environment Variables**:
   - Add your Azure OpenAI environment variables in Azure Static Web Apps Configuration
   - Variables will be available as `process.env.REACT_APP_*`

### PWA Features
- **Service Worker**: Offline functionality
- **Web App Manifest**: Installable on mobile devices
- **Responsive Design**: Works on all screen sizes

### ⚠️ Security Note

**Current Implementation**: API keys are stored in environment variables and bundled with the frontend code. This means:
- API keys are visible in the browser's source code
- Anyone can inspect and use your API keys
- This is **NOT secure for production use**

**Long-term Solution**: Move GPT + TTS API calls to a backend service:
- Create Azure Functions or API endpoints
- Handle API calls server-side
- Keep API keys secure on the server
- Frontend only calls your secure backend endpoints

## 🔍 Troubleshooting

### Common Issues
1. **Audio Not Playing**: Ensure user interaction before audio
2. **TTS Errors**: Check Azure OpenAI API credentials
3. **Profile Issues**: Clear localStorage if profiles become corrupted
4. **Animation Problems**: Check browser support for Framer Motion

### Deployment Issues
1. **Build Failures**: Ensure all dependencies are installed (`npm install`)
2. **Environment Variables**: Verify all `REACT_APP_*` variables are set in Azure
3. **API Errors in Production**: Check if API keys are properly configured
4. **CORS Issues**: Ensure Azure OpenAI endpoints allow your domain

### Debug Mode
- Open browser console for detailed logs
- Check network tab for API calls
- Verify environment variables are loaded

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **React Team**: Amazing framework and ecosystem
- **Azure OpenAI**: High-quality AI services
- **Framer Motion**: Smooth animations
- **Howler.js**: Audio library
- **Web Audio API**: Browser audio capabilities 
