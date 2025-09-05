import React, { useState } from 'react';

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
    
    // Play preloaded animal sound immediately from farm.json sound path
    const animalSound = new Audio(`/${getAnimalSoundPath(animalName)}`);
    animalSound.play();
    
    // Set a simple message since TTS is no longer used
    setGeneratedText(`Hello! I'm a ${animalName}. Click me to hear my sound!`);
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
    
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
