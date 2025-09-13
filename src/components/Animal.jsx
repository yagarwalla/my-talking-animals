import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useProgression } from '../contexts/ProgressionContext.jsx';

const Animal = ({ animal, currentLanguage = 'en', index = 0, totalAnimals = 1 }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const voiceRef = useRef(null);
  
  // Use the progression context
  const { 
    completeAnimal,
    currentLevel,
    setAnimalSpeaking,
    setAnimalFinishedSpeaking,
    isAnimalSpeaking,
    isAnyAnimalSpeaking
  } = useProgression();
  
  // Debug: Log the parent container information
  useEffect(() => {
    const parentContainer = document.querySelector('.area-scene');
    if (parentContainer) {
      console.log(`🔍 Parent container for ${animal.id}:`, {
        element: parentContainer,
        position: window.getComputedStyle(parentContainer).position,
        width: parentContainer.offsetWidth,
        height: parentContainer.offsetHeight,
        rect: parentContainer.getBoundingClientRect()
      });
    }
  }, [animal.id]);
  
  // Load audio files when component mounts
  useEffect(() => {
    if (animal.sound) {
      soundRef.current = new Howl({
        src: [`/${animal.sound}`],
        volume: 0.7,
        preload: true
      });
    }

    // Load voice file for current level and language
    if (animal.levels && animal.levels.length > 0) {
      // Find voice for current level and language direction
      // If user's primary language is English, they want to learn Hindi (en-hi)
      // If user's primary language is Hindi, they want to learn English (hi-en)
      const currentLevelVoice = animal.levels.find(level => 
        level.id === currentLevel && 
        level.direction === (currentLanguage === 'en' ? 'en-hi' : 'hi-en')
      );
      
      if (currentLevelVoice && currentLevelVoice.voice) {
        voiceRef.current = new Howl({
          src: [currentLevelVoice.voice],
          volume: 0.8,
          preload: true
        });
        console.log(`🎵 Loaded Level ${currentLevel} voice for ${animal.id} (${currentLevelVoice.direction}):`, currentLevelVoice.voice);
      } else {
        const expectedDirection = currentLanguage === 'en' ? 'en-hi' : 'hi-en';
        console.warn(`No Level ${currentLevel} voice found for ${animal.id} with direction ${expectedDirection} (user's primary language: ${currentLanguage})`);
      }
    }

    // Cleanup on unmount
    return () => {
      if (soundRef.current) soundRef.current.unload();
      if (voiceRef.current) voiceRef.current.unload();
    };
  }, [animal, currentLanguage, currentLevel]);

  const handleAnimalClick = async (event) => {
    // Debug: Log click event details
    console.log('🖱️ Animal clicked:', animal.id, 'Current talking state:', isTalking);
    console.log('🖱️ Click event target:', event?.target);
    console.log('🖱️ Click event currentTarget:', event?.currentTarget);
    console.log('🖱️ Animal container element:', document.querySelector(`[data-animal-id="${animal.id}"]`));
    
    if (isAnimating || isPlaying || isAnyAnimalSpeaking()) {
      console.log('🚫 Click blocked - already animating, playing, or another animal is speaking');
      return;
    }
    
    console.log('🎬 Setting animation states...');
    setIsAnimating(true);
    setShowSparkles(true);
    setIsTalking(true);
    setIsPlaying(true);
    
    // Set this animal as speaking
    setAnimalSpeaking(animal.id);

    // Track progression after all audio finishes
    const handleProgressionComplete = (result) => {
      console.log('🎉 Animal completed:', result);
      if (result && result.levelUp) {
        console.log('🎊 Level up! New level:', result.progress.currentLevel);
      }
      if (result && result.newStickers && result.newStickers.length > 0) {
        console.log('🏆 New stickers earned:', result.newStickers);
      }
      setAnimalFinishedSpeaking();
    };

    const handleProgressionTimeout = () => {
      console.log(`⏰ Progression timeout fired for ${animal.id}`);
      try {
        const result = completeAnimal(animal.id, handleProgressionComplete);
        // If animal was already completed, still need to re-enable other animals
        if (result && !result.success) {
          console.log('Animal was already completed, re-enabling other animals');
          setAnimalFinishedSpeaking();
        }
      } catch (error) {
        console.error('Error tracking progression:', error);
        setAnimalFinishedSpeaking();
      }
    };

    // Play basic sound first, then level voice
    if (soundRef.current && voiceRef.current) {
      // Play basic sound first
      soundRef.current.play();
      const basicSoundDuration = soundRef.current.duration() * 1000;
      
      console.log(`🔊 Playing basic sound for ${animal.id}, duration: ${basicSoundDuration}ms`);
      
      // Start talking animation for the total duration (basic sound + voice)
      const voiceDuration = voiceRef.current.duration() * 1000;
      const totalDuration = basicSoundDuration + voiceDuration;
      startTalkingAnimation(totalDuration);
      
      // Play level voice after basic sound finishes
      setTimeout(() => {
        voiceRef.current.play();
        console.log(`🎵 Playing Level ${currentLevel} voice for ${animal.id}, duration: ${voiceDuration}ms`);
        
        // Set progression timeout for after voice finishes
        console.log(`⏰ Setting progression timeout for ${animal.id} in ${totalDuration}ms`);
        setTimeout(handleProgressionTimeout, voiceDuration);
      }, basicSoundDuration);
    } else if (voiceRef.current) {
      // Only level voice available
      voiceRef.current.play();
      const duration = voiceRef.current.duration() * 1000;
      startTalkingAnimation(duration);
      console.log(`🎵 Playing Level ${currentLevel} voice for ${animal.id}, duration: ${duration}ms`);
      
      console.log(`⏰ Setting progression timeout for ${animal.id} in ${duration}ms`);
      setTimeout(handleProgressionTimeout, duration);
    } else if (soundRef.current) {
      // Only basic sound available
      soundRef.current.play();
      const duration = soundRef.current.duration() * 1000;
      startTalkingAnimation(duration);
      console.log(`🔊 Playing basic sound for ${animal.id}, duration: ${duration}ms`);
      
      console.log(`⏰ Setting progression timeout for ${animal.id} in ${duration}ms`);
      setTimeout(handleProgressionTimeout, duration);
    } else {
      console.warn('No sound or voice file found for animal:', animal.id);
      // Fallback: just show animation
      startTalkingAnimation(2000); // 2 second fallback animation
      
      console.log(`⏰ Setting progression timeout for ${animal.id} in 2000ms`);
      setTimeout(handleProgressionTimeout, 2000);
    }

    // Hide sparkles after animation
    setTimeout(() => {
      setShowSparkles(false);
      setIsAnimating(false);
      setIsPlaying(false);
    }, 3000);

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
        setIsPlaying(false);
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
      setIsPlaying(false);
    }, duration);
  };

  const getAnimalName = () => {
    return animal.name[currentLanguage] || animal.name.en;
  };

  // Handle both percentage and pixel positioning
  const getPositionStyle = () => {
    // Position animals relative to the farm scene container (like map page)
    if (animal.position) {
      const { x, y } = animal.position;
      
      // Debug: Check the raw values
      console.log(`🔍 Raw values for ${animal.id}:`, { x, y, xType: typeof x, yType: typeof y });
      
      // Convert to percentages relative to the farm scene container
      const left = `${x}%`;
      const top = `${y}%`;
      
      // Base scaling based on screen size
      let baseScale = 0.5; // Default desktop scale
      
      // Check if we're on a smaller screen
      if (window.innerWidth <= 768) {
        baseScale = 0.3; // Mobile: smaller scale
      } else if (window.innerWidth <= 1024) {
        baseScale = 0.4; // Tablet: medium scale
      }
      
      // Apply animal-specific size percentage
      const animalSize = animal.size || 100; // Default to 100% if not specified
      const scale = baseScale * (animalSize / 100);
      
      // Debug logging
      console.log(`🎯 Animal ${animal.id} positioning:`, {
        x, y, left, top, baseScale, animalSize, scale,
        animalPosition: animal.position,
        xType: typeof x,
        yType: typeof y,
        xValue: x,
        yValue: y
      });
      
      const style = {
        left: left,
        top: top,
        transform: `translate(-50%, -50%) scale(${scale})`,
        position: 'absolute',
        zIndex: 10,
        minWidth: '20px',
        minHeight: '20px',
        width: 'auto',
        height: 'auto'
      };
      
      // Debug: Log the computed style
      console.log(`🎯 Animal ${animal.id} computed style:`, style);
      
      return style;
    }
    
    // Fallback if no position config
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%) scale(0.5)',
      zIndex: 10,
        minWidth: '20px',
        minHeight: '20px',
        width: 'auto',
        height: 'auto'
    };
  };

  const positionStyle = getPositionStyle();

  const isDisabled = isAnyAnimalSpeaking() && !isAnimalSpeaking(animal.id);
  const isCurrentlySpeaking = isAnimalSpeaking(animal.id);

  return (
    <div 
      className={`animal-container ${isDisabled ? 'animal-disabled' : ''} ${isCurrentlySpeaking ? 'animal-speaking' : ''}`}
      style={positionStyle}
      data-animal-id={animal.id}
      data-debug="true"
      data-position-x={animal.position?.x}
      data-position-y={animal.position?.y}
      onClick={handleAnimalClick}
    >
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
                  x: Math.cos((i * 60) * Math.PI / 180) * 60,
                  y: Math.sin((i * 60) * Math.PI / 180) * 60,
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
            // Let image scale naturally based on its original size
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
            // Try alternative file extensions or fallback to idle sprite
            if (isTalking && animal.spriteTalking !== animal.spriteIdle) {
              console.log('🔄 Falling back to idle sprite for talking animation');
              e.target.src = `/${animal.spriteIdle}`;
            } else {
              // Try alternative case or extension
              const altPath = currentSprite.replace(/\.(png|PNG)$/, '.PNG');
              if (altPath !== currentSprite) {
                console.log('🔄 Trying alternative path:', altPath);
                e.target.src = `/${altPath}`;
              }
            }
          }}
        />
      </motion.div>




    </div>
  );
};

export default Animal;
