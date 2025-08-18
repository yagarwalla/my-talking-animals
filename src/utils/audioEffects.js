// Audio effects configuration for each animal
const animalAudioConfig = {
  cow: {
    pitchShift: -0.1,      // Slightly lower pitch (gentle deep voice)
    formantShift: 0.95,    // Minimal formant change
    playbackRate: 0.95     // Slightly slower, more gentle
  },
  pig: {
    pitchShift: 0.1,       // Very slight pitch increase
    formantShift: 1.1,     // Subtle nasal quality
    playbackRate: 1.05     // Slightly faster, energetic
  },
  goat: {
    pitchShift: 0.15,      // Gentle pitch increase
    formantShift: 1.05,    // Subtle bright formants
    playbackRate: 1.0      // Normal speed
  },
  sheep: {
    pitchShift: 0.05,      // Very slight pitch increase
    formantShift: 0.98,    // Minimal formant change
    playbackRate: 0.98     // Gentle pace
  },
  hen: {
    pitchShift: 0.2,       // Gentle higher pitch
    formantShift: 1.15,    // Subtle bright formants
    playbackRate: 1.1      // Slightly quick, friendly
  },
  horse: {
    pitchShift: -0.05,     // Very slight pitch decrease
    formantShift: 0.97,    // Minimal formant change
    playbackRate: 0.95     // Gentle, majestic pace
  }
};

// Web Audio API context for effects processing
let audioContext = null;

// Initialize audio context (required for Web Audio API)
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Apply pitch and formant shifting using Web Audio API
const applyAudioEffects = async (audioBuffer, animalId) => {
  const config = animalAudioConfig[animalId.toLowerCase()] || animalAudioConfig.cow;
  const ctx = initAudioContext();
  
  // Create source from audio buffer
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  
  // Pitch shifting using playback rate
  source.playbackRate.value = 1 + config.pitchShift;
  
  // Formant shifting using filters
  const lowpassFilter = ctx.createBiquadFilter();
  lowpassFilter.type = 'lowpass';
  lowpassFilter.frequency.value = 800 * config.formantShift;
  lowpassFilter.Q.value = 1.0;
  
  const highpassFilter = ctx.createBiquadFilter();
  highpassFilter.type = 'highpass';
  highpassFilter.frequency.value = 200 * config.formantShift;
  highpassFilter.Q.value = 0.5;
  
  // Connect the audio pipeline
  source.connect(lowpassFilter);
  lowpassFilter.connect(highpassFilter);
  highpassFilter.connect(ctx.destination);
  
  return { source, config };
};

// Main function to play animal voice with effects
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
    
    // Convert blob to audio buffer for effects processing
    const arrayBuffer = await audioBlob.arrayBuffer();
    const ctx = initAudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    
    // Apply animal-specific audio effects
    const { source, config } = await applyAudioEffects(audioBuffer, animal.id);
    
    // Play the modified audio
    source.start(0);
    
    // Cleanup
    source.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    return {
      success: true,
      audioUrl,
      duration: audioBuffer.duration,
      effects: config
    };
    
  } catch (error) {
    console.error('Error in playAnimalVoice:', error);
    throw error;
  }
};

// Utility function to get animal audio configuration
export const getAnimalAudioConfig = (animalId) => {
  return animalAudioConfig[animalId.toLowerCase()] || animalAudioConfig.cow;
};

// Cleanup function for audio context
export const cleanupAudioContext = () => {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
};
