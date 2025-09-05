// This file is deprecated - TTS functionality has been replaced with static MP3 files
// See progression.js and ProgressionContext.jsx for the new implementation

console.warn('audioEffects.js is deprecated. Use static MP3 files with the progression system instead.');

// Legacy function for backward compatibility - now returns a mock response
export const playAnimalVoice = async (animal, text) => {
  console.warn('playAnimalVoice is deprecated. Use static MP3 files with the progression system instead.');
  
  return {
    success: true,
    audioUrl: null,
    duration: 2000, // 2 seconds default
    playbackRate: 1.0
  };
};

// Utility function to get animal playback rate - deprecated
export const getAnimalPlaybackRate = (animalId) => {
  console.warn('getAnimalPlaybackRate is deprecated.');
  return 1.0;
};
