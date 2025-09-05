import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import ProfileSelector from './components/ProfileSelector';
import LandscapeEnforcer from './components/LandscapeEnforcer';

import MapScreen from './components/MapScreen';
import AreaScreen from './components/AreaScreen';
import AnimalDemo from './components/AnimalDemo';
import TemplateDemo from './components/TemplateDemo';
import { AnimalSessionProvider } from './contexts/AnimalSessionContext.jsx';
import { ProgressionProvider } from './contexts/ProgressionContext.jsx';

// Audio Player Component using Web Audio API
const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const createTone = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    oscillatorRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    oscillatorRef.current.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
    oscillatorRef.current.type = 'sine';

    gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 2);

    oscillatorRef.current.start(audioContextRef.current.currentTime);
    oscillatorRef.current.stop(audioContextRef.current.currentTime + 2);

    setIsPlaying(true);

    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const handlePlay = () => {
    if (!isPlaying) {
      createTone();
    }
  };

  const handleStop = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioContextRef.current?.currentTime || 0);
    }
  };

  return (
    <div className="audio-player fade-in">
      <h3>Audio Player</h3>
      
      <div className="audio-controls">
        <button
          className="audio-button play"
          onClick={handlePlay}
          disabled={isPlaying}
        >
          {isPlaying ? 'Playing...' : 'Play Tone'}
        </button>
        
        <button
          className="audio-button stop"
          onClick={handleStop}
          disabled={!isPlaying}
        >
          Stop
        </button>
      </div>

      <div className="volume-control">
        <label className="volume-label">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>

      <div className={`audio-status ${isPlaying ? 'playing' : 'idle'}`}>
        {isPlaying ? '🎵 Playing A4 tone (440Hz)...' : 'Click Play to hear a sine wave tone'}
      </div>
    </div>
  );
};

// Howler Audio Player Component
const HowlerAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const createBeepSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    setIsPlaying(true);
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 300);
  };

  const handlePlay = () => {
    if (!isPlaying) {
      createBeepSound();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="audio-player fade-in">
      <h3>Howler.js Demo</h3>
      
      <div className="audio-controls">
        <button
          className="audio-button beep"
          onClick={handlePlay}
          disabled={isPlaying}
        >
          {isPlaying ? 'Beeping...' : 'Play Beep'}
        </button>
        
        <button
          className="audio-button stop"
          onClick={handleStop}
          disabled={!isPlaying}
        >
          Stop
        </button>
      </div>

      <div className="volume-control">
        <label className="volume-label">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>

      <div className={`audio-status ${isPlaying ? 'playing' : 'idle'}`}>
        {isPlaying ? '🔊 Playing beep sound...' : 'Click Play to hear a beep sound (800Hz square wave)'}
      </div>
    </div>
  );
};

// Demo Home Component (original app content)
const DemoHome = () => {

  return (
    <div className="App">
      {/* Main Content */}
      <div className="App-content fade-in">
        <header className="App-header">
          <img
            src={logo}
            className="App-logo"
            alt="logo"
          />
          
          <h1 className="fade-in">
            My Talking Animals
          </h1>
          
          <p className="fade-in">
            A React PWA with TailwindCSS, Howler.js, and Framer Motion
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AudioPlayer />
            <HowlerAudioPlayer />
          </div>
          
          <a
            className="App-link scale-hover scale-active"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: '2rem' }}
          >
            Learn React
          </a>
          
          <a
            className="App-link scale-hover scale-active"
            href="/animal-demo"
            style={{ marginTop: '1rem' }}
          >
            Try Animal Speech Demo
          </a>
          
          <a
            className="App-link scale-hover scale-active"
            href="/template-demo"
            style={{ marginTop: '1rem' }}
          >
            View Template System Demo
          </a>
        </header>
      </div>
    </div>
  );
};

// Main App Component with Router
function App() {
  return (
    <ProgressionProvider>
      <AnimalSessionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProfileSelector />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/area/:areaId" element={<AreaScreen />} />
                    <Route path="/demo" element={<DemoHome />} />
          <Route path="/animal-demo" element={<AnimalDemo />} />
          <Route path="/template-demo" element={<TemplateDemo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <LandscapeEnforcer />
        </Router>
      </AnimalSessionProvider>
    </ProgressionProvider>
  );
}

export default App; 