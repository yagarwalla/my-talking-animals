import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';

const HowlerAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSound, setCurrentSound] = useState(null);

  const sounds = [
    { name: 'Cow Moo', file: '/sounds/cow-moo.mp3' },
    { name: 'Horse Neigh', file: '/sounds/horse-neigh.mp3' },
    { name: 'Pig Oink', file: '/sounds/pig-oink.mp3' },
    { name: 'Sheep Baa', file: '/sounds/sheep-baa.mp3' },
    { name: 'Chicken Cluck', file: '/sounds/chicken-cluck.mp3' }
  ];

  const playSound = (soundFile) => {
    if (currentSound) {
      currentSound.stop();
    }

    const sound = new Howl({
      src: [soundFile],
      volume: volume,
      onend: () => {
        setIsPlaying(false);
        setCurrentSound(null);
      }
    });

    setCurrentSound(sound);
    setIsPlaying(true);
    sound.play();
  };

  const stopSound = () => {
    if (currentSound) {
      currentSound.stop();
      setIsPlaying(false);
      setCurrentSound(null);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (currentSound) {
      currentSound.volume(newVolume);
    }
  };

  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stop();
      }
    };
  }, [currentSound]);

  return (
    <div className="howler-audio-player fade-in">
      <h3>Animal Sounds Player</h3>
      
      <div className="sound-buttons">
        {sounds.map((sound, index) => (
          <button
            key={index}
            className="sound-button"
            onClick={() => playSound(sound.file)}
            disabled={isPlaying}
          >
            {sound.name}
          </button>
        ))}
      </div>

      <div className="audio-controls">
        <button
          className="audio-button stop"
          onClick={stopSound}
          disabled={!isPlaying}
        >
          Stop Sound
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
        {isPlaying ? '🔊 Playing animal sound...' : 'Click any animal sound to play it!'}
      </div>
    </div>
  );
};

export default HowlerAudioPlayer;
