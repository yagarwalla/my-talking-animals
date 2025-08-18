// Simple playback rate configuration for each animal
const animalPlaybackRates = {
  cow: 0.85,    // Slower, deeper voice
  pig: 0.9,     // Slightly slower
  goat: 1.2,    // Faster, higher voice
  sheep: 0.95,  // Slightly slower
  hen: 1.4,     // Much faster, chirpy voice
  horse: 0.9    // Slower, majestic voice
};



// Main function to play animal voice with simple playback rate adjustment
export const playAnimalVoice = async (animal, text) => {
  try {
    // Get Azure TTS audio (existing functionality)
    const response = await fetch(`${process.env.REACT_APP_TTS_ENDPOINT}/audio/speech?api-version=2025-03-01-preview`, {
      method: 'POST',
      headers: {
        'api-key': process.env.REACT_APP_AZURE_AI_FOUNDRY_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        output_format: 'mp3',
        rate: 1.0,
        pitch: 1.0
      })
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create simple HTML5 Audio element
    const audio = new Audio(audioUrl);
    
    // Apply animal-specific playback rate
    const playbackRate = getAnimalPlaybackRate(animal.id);
    audio.playbackRate = playbackRate;
    
    // Play the audio
    await audio.play();
    
    // Cleanup when audio ends
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    return {
      success: true,
      audioUrl,
      duration: audio.duration / playbackRate, // Adjust duration for playback rate
      playbackRate: playbackRate
    };
    
  } catch (error) {
    console.error('Error in playAnimalVoice:', error);
    throw error;
  }
};

// Utility function to get animal playback rate
export const getAnimalPlaybackRate = (animalId) => {
  return animalPlaybackRates[animalId.toLowerCase()] || 1.0;
};
