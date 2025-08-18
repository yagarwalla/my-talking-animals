import React, { useState, useEffect } from 'react';
import { generateAnimalVoice } from '../utils/generateAnimalSpeech';

const AnimalCard = ({ animalName, onAnimalClick }) => {
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Get the sound path from farm.json structure
  const getAnimalSoundPath = (animalName) => {
    const animalSounds = {
      'Cow': 'animals/cow/moo.mp3',
      'Pig': 'animals/pig/oink.mp3',
      'Goat': 'animals/goat/baa.mp3',
      'Sheep': 'animals/sheep/baa.mp3',
      'Hen': 'animals/hen/cluck.mp3',
      'Horse': 'animals/horse/neigh.mp3'
    };
    return animalSounds[animalName] || `animals/${animalName.toLowerCase()}/sound.mp3`;
  };

  const handleAnimalClick = async () => {
    if (isGenerating) return; // Prevent multiple clicks while generating
    
    setIsGenerating(true);
    
    // 1. Play preloaded animal sound immediately from farm.json sound path
    const animalSound = new Audio(`/${getAnimalSoundPath(animalName)}`);
    animalSound.play();
    
    try {
      // 2. Call generateAnimalSpeech while sound plays
      const result = await generateAnimalVoice(
        animalName,
        'en', // hardcoded for now
        process.env.REACT_APP_AZURE_AI_FOUNDRY_KEY,
        process.env.REACT_APP_GPT_ENDPOINT,
        process.env.REACT_APP_TTS_ENDPOINT
      );
      
      // 3. When Promise resolves, display text and play audio
      setGeneratedText(result.text);
      
      console.log('🎵 Audio URL received:', result.audioUrl);
      
      // Play the generated speech audio
      try {
        const speechAudio = new Audio(result.audioUrl);
        
        speechAudio.onloadstart = () => console.log('🎵 Audio loading started');
        speechAudio.oncanplay = () => console.log('🎵 Audio can play');
        speechAudio.onerror = (e) => console.error('🎵 Audio playback error:', e);
        speechAudio.onended = () => console.log('🎵 Audio playback ended');
        
        const playPromise = speechAudio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log('🎵 Audio playback started successfully'))
            .catch(error => console.error('🎵 Audio playback failed:', error));
        }
      } catch (error) {
        console.error('🎵 Audio creation error:', error);
      }
      
    } catch (error) {
      console.error('Error generating animal speech:', error);
      setGeneratedText('Sorry, I couldn\'t speak right now!');
    } finally {
      setIsGenerating(false);
    }
    
    // Call parent handler if provided
    if (onAnimalClick) {
      onAnimalClick(animalName);
    }
  };

  return (
    <div className="animal-card" onClick={handleAnimalClick}>
      <img 
        src={`/animals/${animalName.toLowerCase()}/${animalName.toLowerCase()}_idle.PNG`}
        alt={animalName}
        style={{ cursor: 'pointer', width: '200px', height: '150px' }}
      />
      
      {/* Display generated text below the image */}
      {generatedText && (
        <div className="generated-text" style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {generatedText}
        </div>
      )}
      
      {/* Loading indicator while generating */}
      {isGenerating && (
        <div className="generating-indicator" style={{ 
          marginTop: '10px', 
          textAlign: 'center',
          color: '#666'
        }}>
          Thinking...
        </div>
      )}
    </div>
  );
};

export default AnimalCard;
