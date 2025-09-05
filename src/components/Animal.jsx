import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useProgression } from '../contexts/ProgressionContext.jsx';

const Animal = ({ animal, onAnimalClick, currentLanguage = 'en', index = 0, totalAnimals = 1 }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const voiceRef = useRef(null);
  
  // Use the progression context
  const { 
    getAnimalVoice, 
    completeAnimal, 
    isAnimalUnlocked, 
    getAnimalProgress,
    currentLevel 
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

    // Get the voice file for current level and language
    const voiceFile = getAnimalVoice(animal, currentLanguage);
    if (voiceFile) {
      voiceRef.current = new Howl({
        src: [voiceFile],
        volume: 0.8,
        preload: true
      });
    }

    // Cleanup on unmount
    return () => {
      if (soundRef.current) soundRef.current.unload();
      if (voiceRef.current) voiceRef.current.unload();
    };
  }, [animal, currentLanguage, getAnimalVoice]);

  const handleAnimalClick = async (event) => {
    // Debug: Log click event details
    console.log('🖱️ Animal clicked:', animal.id, 'Current talking state:', isTalking);
    console.log('🖱️ Click event target:', event?.target);
    console.log('🖱️ Click event currentTarget:', event?.currentTarget);
    console.log('🖱️ Animal container element:', document.querySelector(`[data-animal-id="${animal.id}"]`));
    
    if (isAnimating || isPlaying) {
      console.log('🚫 Click blocked - already animating or playing');
      return;
    }
    
    // Check if animal is unlocked for current level
    if (!isAnimalUnlocked(animal.id)) {
      console.log('🚫 Animal not unlocked for current level');
      return;
    }
    
    console.log('🎬 Setting animation states...');
    setIsAnimating(true);
    setShowSparkles(true);
    setIsTalking(true);
    setIsPlaying(true);

    // 1. Play preloaded animal sound immediately
    if (soundRef.current) {
      soundRef.current.play();
    }

    try {
      // 2. Play the voice file for current level
      if (voiceRef.current) {
        voiceRef.current.play();
        
        // Get audio duration for animation
        const duration = voiceRef.current.duration() * 1000; // Convert to milliseconds
        startTalkingAnimation(duration);
        
        // Mark animal as completed for this level
        const result = completeAnimal(animal.id);
        console.log('🎉 Animal completed:', result);
        
        // Show level up notification if applicable
        if (result.levelUp) {
          console.log('🎊 Level up! New level:', result.progress.currentLevel);
        }
        
        // Show new stickers if any
        if (result.newStickers.length > 0) {
          console.log('🏆 New stickers earned:', result.newStickers);
        }
      } else {
        console.warn('No voice file found for animal:', animal.id);
        // Fallback: just play sound and short animation
        startTalkingAnimation(2000);
      }
      
    } catch (error) {
      console.error('Error playing animal voice:', error);
      // Stop talking animation on error
      setIsTalking(false);
    } finally {
      setIsPlaying(false);
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
    // Position animals relative to the farm scene container (like map page)
    if (animal.position) {
      const { x, y } = animal.position;
      
      // Debug: Check the raw values
      console.log(`🔍 Raw values for ${animal.id}:`, { x, y, xType: typeof x, yType: typeof y });
      
      // Convert to percentages relative to the farm scene container
      const left = `${x}%`;
      const top = `${y}%`;
      
      // Responsive scaling based on screen size
      let scale = 0.5; // Default desktop scale
      
      // Check if we're on a smaller screen
      if (window.innerWidth <= 768) {
        scale = 0.3; // Mobile: smaller scale
      } else if (window.innerWidth <= 1024) {
        scale = 0.4; // Tablet: medium scale
      }
      
      // Debug logging
      console.log(`🎯 Animal ${animal.id} positioning:`, {
        x, y, left, top, scale,
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

  const positionStyle = useMemo(() => getPositionStyle(), [index, totalAnimals, animal.position]);

  return (
    <div 
      className="animal-container" 
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
            // Fallback to idle sprite if talking sprite fails
            if (isTalking) {
              e.target.src = `/${animal.spriteIdle}`;
            }
          }}
        />
      </motion.div>



      {/* Playing Indicator */}
      {isPlaying && (
        <motion.div
          className="playing-indicator"
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
          Playing...
        </motion.div>
      )}

    </div>
  );
};

export default Animal;
