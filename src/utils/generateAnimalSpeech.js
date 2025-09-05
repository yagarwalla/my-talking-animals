// This file is deprecated - TTS functionality has been replaced with static MP3 files
// See progression.js and ProgressionContext.jsx for the new implementation

console.warn('generateAnimalSpeech.js is deprecated. Use static MP3 files with the progression system instead.');

// Legacy function for backward compatibility - now returns a mock response
export const generateAnimalVoice = (animalName, languageCode, azureKey, gptEndpoint, ttsEndpoint) => {
  console.warn('generateAnimalVoice is deprecated. Use static MP3 files with the progression system instead.');
  
  return new Promise((resolve) => {
    // Return a mock response to prevent errors
    resolve({
      text: `Hello! I'm a ${animalName}. This is a placeholder message.`,
      audioUrl: null
    });
  });
};
