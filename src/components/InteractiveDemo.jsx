import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Try different image paths
  const getImageSrc = (isPlaying) => {
    const basePaths = [
      '/animals/horse/',
      './animals/horse/',
      'animals/horse/',
      '/public/animals/horse/'
    ];
    
    const fileName = isPlaying ? 'horse_openmouth.png' : 'horse_idle.png';
    
    // For now, let's try the first path and see what happens
    return basePaths[0] + fileName;
  };

  // Fallback to base64 if images don't load
  const getFallbackImage = (isPlaying) => {
    // Simple SVG fallback for horse
    const horseSvg = isPlaying ? 
      `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="60" fill="#fbbf24" stroke="#f59e0b" stroke-width="4"/>
        <text x="64" y="80" text-anchor="middle" font-size="60">🐴</text>
        <text x="64" y="100" text-anchor="middle" font-size="20" fill="#92400e">🗣️</text>
      </svg>` :
      `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="60" fill="#fbbf24" stroke="#f59e0b" stroke-width="4"/>
        <text x="64" y="80" text-anchor="middle" font-size="60">🐴</text>
      </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(horseSvg)}`;
  };

  // Initialize with fallback if we know images will fail
  useEffect(() => {
    // Check if we're in production and images are likely to fail
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.log('🌐 Production detected, using SVG fallback');
      setImageError(true);
    }
  }, []);

  // Reset image error when playing state changes
  useEffect(() => {
    setImageError(false);
  }, [isPlaying]);

  const playHorseSound = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    // Play the horse level 1 English to Hindi sound
    const audio = new Audio('/animals/horse/horse_level1_en_hi.mp3');
    
    audio.onended = () => {
      setIsPlaying(false);
      if (!hasPlayed) {
        setShowSticker(true);
        setHasPlayed(true);
        // Keep sticker visible permanently - no timeout
      }
    };
    
    audio.onerror = () => {
      console.log('Audio file not found, using fallback sound');
      setIsPlaying(false);
      if (!hasPlayed) {
        setShowSticker(true);
        setHasPlayed(true);
        // Keep sticker visible permanently - no timeout
      }
    };
    
    audio.play().catch(() => {
      console.log('Audio play failed, using fallback');
      setIsPlaying(false);
      if (!hasPlayed) {
        setShowSticker(true);
        setHasPlayed(true);
        // Keep sticker visible permanently - no timeout
      }
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl border-4 border-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #667eea 2px, transparent 2px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Demo Title */}
        <div className="text-center mb-6 relative z-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 font-['Poppins']">
            Interactive Demo
          </h3>
            <p className="text-gray-600 text-sm">
              Click the horse to hear it talk!
            </p>
        </div>

        {/* Horse Container */}
        <div className="flex justify-center mb-6 relative z-10">
          <motion.div
            className="relative cursor-pointer"
            onClick={playHorseSound}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {/* Horse Image */}
            <div className="relative">
              <img
                src={imageError ? getFallbackImage(isPlaying) : getImageSrc(isPlaying)}
                alt="Horse - Tap to hear it talk!"
                className="w-32 h-32 object-contain drop-shadow-lg transition-all duration-300"
                onError={(e) => {
                  console.log('❌ Image failed to load:', e.target.src);
                  console.log('🔍 Trying SVG fallback...');
                  setImageError(true);
                }}
                onLoad={() => {
                  if (!imageError) {
                    console.log('✅ Image loaded successfully:', getImageSrc(isPlaying));
                  } else {
                    console.log('✅ SVG fallback loaded successfully');
                  }
                }}
              />
              
              {/* Speaking indicator */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg"
                  >
                    <div className="text-2xl">🗣️</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tap instruction */}
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Click me! 👆
            </motion.div>
          </motion.div>
        </div>

        {/* Level indicator */}
        <div className="text-center mt-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-medium text-gray-700">Level 1</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">English → Hindi</span>
          </div>
        </div>

        {/* Sticker Award - Positioned next to horse */}
        <AnimatePresence>
          {showSticker && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -50, y: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, x: -50, y: 50 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.5 
              }}
              className="absolute top-8 right-8 z-20"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: 2
                }}
                className="relative"
              >
                <img
                  src="/animals/stickers/level1/level1_sticker.png"
                  alt="Level 1 Sticker"
                  className="w-20 h-20 object-contain drop-shadow-lg"
                  onError={(e) => {
                    // Fallback to emoji if image not found
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                {/* Fallback emoji */}
                <div className="w-20 h-20 flex items-center justify-center text-6xl" style={{ display: 'none' }}>
                  ⭐
                </div>
                
                {/* Celebration sparkles around sticker */}
                <motion.div
                  className="absolute -top-2 -right-2 text-2xl"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: 2,
                    delay: 0.5
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2 text-xl"
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1.2,
                    repeat: 2,
                    delay: 0.7
                  }}
                >
                  🌟
                </motion.div>
              </motion.div>
              
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating sparkles */}
        <motion.div
          className="absolute top-4 left-4 text-2xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 text-2xl"
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
        >
          🌟
        </motion.div>
    </div>
  );
};

export default InteractiveDemo;
