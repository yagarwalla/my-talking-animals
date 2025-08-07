# My Talking Animals

A React Progressive Web App (PWA) built with modern web technologies including TailwindCSS, Howler.js, and React Router.

## Features

- **Progressive Web App (PWA)**: Installable on mobile devices with offline capabilities
- **Profile Selection**: Interactive profile setup for children with language preferences
- **Responsive Design**: Optimized for both portrait and landscape orientations
- **Landscape Orientation Check**: Shows a "Rotate Device" overlay in portrait mode
- **Audio Playback**: Two different audio implementations:
  - Web Audio API for pure sine wave tones
  - Howler.js integration for more complex audio features
- **Smooth Animations**: CSS animations and transitions
- **Modern Styling**: TailwindCSS for utility-first CSS framework
- **Client-Side Routing**: React Router for seamless navigation

## Technologies Used

- **React 19**: Latest version of React with modern features
- **Create React App**: PWA template for easy setup
- **React Router**: Client-side routing for navigation
- **TailwindCSS v3**: Utility-first CSS framework (stable version)
- **Howler.js**: Audio library for web applications
- **Web Audio API**: Native browser audio capabilities
- **Service Workers**: For PWA functionality and offline support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-talking-animals
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with the production-ready files.

## Project Structure

```
my-talking-animals/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── components/
│   │   ├── ProfileSelector.jsx    # Profile setup component
│   │   └── Map.jsx                # Map screen component
│   ├── App.jsx                    # Main app with routing
│   ├── index.css                  # All styles including TailwindCSS
│   ├── index.js                   # App entry point
│   └── logo.svg
├── tailwind.config.js             # TailwindCSS configuration
├── postcss.config.js              # PostCSS configuration
└── package.json
```

## Key Features Explained

### Profile Selector Screen

The app starts with a profile setup screen that allows parents to:
- Enter their child's name
- Select primary language (English/Hindi)
- Select secondary language (English/Hindi)
- Save profile to localStorage
- Navigate to the map screen

### Landscape Orientation Check

The app automatically detects device orientation and shows a beautiful overlay when in portrait mode, encouraging users to rotate their device for the best experience.

### Audio Player Components

The app includes two different audio implementations within a single file:

#### 1. AudioPlayer (Web Audio API)
- Uses native Web Audio API
- Generates pure sine wave tones (440Hz A4 note)
- 2-second duration with fade-out
- Real-time volume control
- No external dependencies

#### 2. HowlerAudioPlayer (Howler.js)
- Demonstrates Howler.js integration
- Generates beep sounds (800Hz square wave)
- 300ms duration for quick feedback
- Volume control integration
- Shows Howler.js capabilities

### PWA Features

- **Service Worker**: Enables offline functionality
- **Web App Manifest**: Makes the app installable
- **Responsive Design**: Works on all device sizes

## Routing

The app uses React Router for navigation:

- **`/`** - Profile Selector (default route)
- **`/map`** - Map screen (requires profile setup)
- **`/demo`** - Demo screen with audio players
- **`*`** - Redirects to profile selector

## Code Organization

### App.jsx
Contains all React components and logic:
- Main App component with React Router setup
- DemoHome component (original app content)
- AudioPlayer component (Web Audio API)
- HowlerAudioPlayer component (Howler.js)
- Rotate device overlay
- All event handlers and state management

### ProfileSelector.jsx
Profile setup component:
- Name input field
- Language selection (primary/secondary)
- Form validation
- localStorage integration
- Navigation to map screen

### Map.jsx
Map screen component:
- Profile data display
- Placeholder for interactive map
- Back navigation functionality
- Profile validation

### index.css
Contains all styling:
- TailwindCSS directives (@tailwind base, components, utilities)
- Custom CSS for app layout and components
- Profile selector styles
- Map screen styles
- Audio player styles
- Rotate overlay styles
- Animation classes
- Responsive design rules

## Customization

### Adding New Routes

To add new routes, update the Routes in App.jsx:

```javascript
<Routes>
  <Route path="/" element={<ProfileSelector />} />
  <Route path="/map" element={<Map />} />
  <Route path="/new-route" element={<NewComponent />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Profile Data Structure

The profile is saved to localStorage with this structure:

```javascript
{
  kidName: "Child's Name",
  primaryLanguage: "English",
  secondaryLanguage: "Hindi",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Adding New Audio Files

To add custom audio files with Howler.js:

```javascript
const sound = new Howl({
  src: ['path/to/your/audio.mp3'],
  volume: 0.5,
});
```

### Creating Custom Tones

To create custom tones with Web Audio API:

```javascript
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
oscillator.type = 'sine';
```

### Styling with TailwindCSS

The project is configured with TailwindCSS v3. You can customize the design by modifying the `tailwind.config.js` file or adding custom classes in `index.css`.

### Animation Customization

CSS animations can be customized in `index.css`. The app includes fade-in animations and hover effects.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Web Audio API requires user interaction before playing audio in some browsers.

## Troubleshooting

### Audio Issues
- Ensure user interaction before playing audio
- Check browser autoplay policies
- Verify audio context is not suspended

### TailwindCSS Issues
- This project uses TailwindCSS v3 (stable) instead of v4
- PostCSS configuration is properly set up
- All utility classes should work correctly

### Routing Issues
- Ensure React Router is properly installed
- Check that all route components are imported
- Verify that the Router wraps the entire app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- React team for the amazing framework
- React Router for client-side routing
- TailwindCSS for the utility-first CSS approach
- Howler.js for audio functionality
- Web Audio API for native browser audio capabilities 