import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

const Animal = ({ animal, onAnimalClick, currentLanguage = 'en' }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
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
    if (isAnimating) return; // Prevent multiple clicks during animation
    
    setIsAnimating(true);
    setShowSparkles(true);
    setIsTalking(true);

    // Play voice line first
    if (voiceRef.current) {
      voiceRef.current.play();
    }

    // Wait a bit then play animal sound
    setTimeout(() => {
      if (soundRef.current) {
        soundRef.current.play();
      }
    }, 500);

    // Stop talking after animation
    setTimeout(() => {
      setIsTalking(false);
    }, 2000);

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
          onError={(e) => {
            console.error('Failed to load animal sprite:', e.target.src);
            // Fallback to idle sprite if talking sprite fails
            if (isTalking) {
              e.target.src = `/${animal.spriteIdle}`;
            }
          }}
        />
      </motion.div>


    </div>
  );
};

export default Animal;
