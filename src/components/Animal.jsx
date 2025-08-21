import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { generateAnimalVoice } from '../utils/generateAnimalSpeech';
import { playAnimalVoice } from '../utils/audioEffects';

const Animal = ({ animal, onAnimalClick, currentLanguage = 'en' }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  
  const soundRef = useRef(null);
  const voiceRef = useRef(null);

  // Load audio files when component mounts
  useEffect(() => {
    if (animal.sound) {
      soundRef.current = new Howl({
        src: [`/${animal.sound}`],
        volume: 0.7,
        preload: true
      });
    }

    if (animal.voice) {
      voiceRef.current = new Howl({
        src: [`/${animal.voice}`],
        volume: 0.8,
        preload: true
      });
    }

    // Cleanup on unmount
    return () => {
      if (soundRef.current) soundRef.current.unload();
      if (voiceRef.current) voiceRef.current.unload();
    };
  }, [animal.sound, animal.voice]);

  const handleAnimalClick = async () => {
    // Force rebuild comment - Azure deployment test
    console.log('🖱️ Animal clicked:', animal.id, 'Current talking state:', isTalking);
    
    if (isAnimating || isGenerating) {
      console.log('🚫 Click blocked - already animating or generating');
      return;
    }
    
    console.log('🎬 Setting animation states...');
    setIsAnimating(true);
    setShowSparkles(true);
    setIsTalking(true);
    setIsGenerating(true);

    // 1. Play preloaded animal sound immediately
    if (soundRef.current) {
      soundRef.current.play();
    }

    try {
      // Debug: Check environment variables
              console.log('🔍 Environment variables check (updated):', {
          azureKey: process.env.REACT_APP_AZURE_AI_FOUNDRY_KEY ? '***' : 'MISSING',
          gptEndpoint: process.env.REACT_APP_GPT_ENDPOINT || 'MISSING',
          ttsEndpoint: process.env.REACT_APP_TTS_ENDPOINT || 'MISSING'
        });
      
      // 2. Call generateAnimalSpeech while sound plays
      const result = await generateAnimalVoice(
        animal.id,
        currentLanguage,
        process.env.REACT_APP_AZURE_AI_FOUNDRY_KEY,
        process.env.REACT_APP_GPT_ENDPOINT,
        process.env.REACT_APP_TTS_ENDPOINT
      );
      
      // 3. When Promise resolves, play audio and start talking animation
      
      // Use new audio effects system instead of direct Audio playback
      const audioResult = await playAnimalVoice(animal, result.text);
      
      // Start talking animation based on processed audio duration
      const animationDuration = audioResult.duration * 1000;
      startTalkingAnimation(animationDuration);
      
    } catch (error) {
      console.error('Error generating animal speech:', error);

      // Stop talking animation on error
      setIsTalking(false);
    } finally {
      setIsGenerating(false);
    }

    // Hide sparkles after animation
    setTimeout(() => {
      setShowSparkles(false);
      setIsAnimating(false);
    }, 3000);

    // Call parent handler
    if (onAnimalClick) {
      onAnimalClick(animal);
    }
  };

  // Function to cycle between idle and talking sprites
  const startTalkingAnimation = (duration) => {
    console.log('🎬 Starting talking animation for:', duration, 'ms');
    let startTime = Date.now();
    const talkingDuration = 1200; // Talking sprite visible for 1.2 seconds (longer)
    const idleDuration = 800;     // Idle sprite visible for 0.8 seconds
    const totalCycle = talkingDuration + idleDuration; // 2 seconds total cycle
    
    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        console.log('🎬 Animation completed, clearing interval');
        clearInterval(animationInterval);
        setIsTalking(false);
        return;
      }
      
      // Calculate position in current cycle
      const cyclePosition = elapsed % totalCycle;
      const newTalkingState = cyclePosition < talkingDuration;
      
      // Show talking sprite for first 1.2 seconds of each cycle, idle for last 0.8 seconds
      if (newTalkingState !== isTalking) {
        console.log('🎬 Switching sprite:', newTalkingState ? 'TALKING' : 'IDLE', 'at', elapsed, 'ms');
        setIsTalking(newTalkingState);
      }
    }, 100); // Check every 100ms for smooth transitions
    
    // Cleanup interval after duration
    setTimeout(() => {
      console.log('🎬 Animation cleanup timeout');
      clearInterval(animationInterval);
      setIsTalking(false);
    }, duration);
  };

  const getAnimalName = () => {
    return animal.name[currentLanguage] || animal.name.en;
  };

  // Handle both percentage and pixel positioning
  const getPositionStyle = () => {
    const { x, y } = animal.position;
    
    // Check if position values are percentages or pixels
    const isPercentage = typeof x === 'string' && x.includes('%');
    
    if (isPercentage) {
      const style = {
        left: x,
        top: y,
        transform: 'translate(-50%, -50%) scale(0.5)', // Center and scale the animal
        position: 'absolute',
        zIndex: 10,
        // Force size consistency
        minWidth: 'auto',
        minHeight: 'auto',
        maxWidth: 'none',
        maxHeight: 'none'
      };
      console.log(`Animal ${animal.id} style:`, style); // Debug log
      return style;
    } else {
      // Pixel positioning (fallback)
      const style = {
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%) scale(0.5)', // Center and scale the animal
        position: 'absolute',
        zIndex: 10,
        // Force size consistency
        minWidth: 'auto',
        minHeight: 'auto',
        maxWidth: 'none',
        maxHeight: 'none'
      };
      console.log(`Animal ${animal.id} style:`, style); // Debug log
      return style;
    }
  };

  return (
    <div className="animal-container" style={getPositionStyle()}>
      {/* Sparkle Effect */}
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            className="sparkle-container"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="sparkle"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '8px',
                  height: '8px',
                  background: '#FFD700',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  x: Math.cos((i * 60) * Math.PI / 180) * 40,
                  y: Math.sin((i * 60) * Math.PI / 180) * 40,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animal Sprite */}
      <motion.div
        className="animal-sprite"
        onClick={handleAnimalClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: isTalking ? [0, -10, 0] : 0,
          rotate: isTalking ? [0, -5, 5, -5, 0] : 0
        }}
        transition={{
          duration: isTalking ? 0.6 : 0.2,
          ease: "easeInOut"
        }}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={`/${isTalking ? animal.spriteTalking : animal.spriteIdle}`}
          alt={getAnimalName()}
          style={{
            objectFit: 'contain',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
            transition: 'all 0.3s ease',
            // Force consistent sizing
            width: 'auto',
            height: 'auto',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
          onLoad={() => {
            const currentSprite = isTalking ? animal.spriteTalking : animal.spriteIdle;
            console.log('✅ Image loaded successfully:', currentSprite);
          }}
          onError={(e) => {
            const currentSprite = isTalking ? animal.spriteTalking : animal.spriteIdle;
            console.error('❌ Image failed to load:', currentSprite, 'URL:', e.target.src);
            // Fallback to idle sprite if talking sprite fails
            if (isTalking) {
              e.target.src = `/${animal.spriteIdle}`;
            }
          }}
        />
      </motion.div>



      {/* Loading Indicator */}
      {isGenerating && (
        <motion.div
          className="generating-indicator"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(52, 152, 219, 0.9)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 20
          }}
        >
          Thinking...
        </motion.div>
      )}

    </div>
  );
};

export default Animal;
