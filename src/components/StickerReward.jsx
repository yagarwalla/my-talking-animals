import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickerReward = ({ 
  isVisible = false, 
  stickerSrc = '/animals/cow/cow_idle.png', 
  onAnimationComplete = () => {} 
}) => {
  const [showBigSticker, setShowBigSticker] = useState(false);
  const [stickers, setStickers] = useState([]);

  // Load stickers from localStorage on component mount
  useEffect(() => {
    const savedStickers = localStorage.getItem('collectedStickers');
    if (savedStickers) {
      try {
        const parsedStickers = JSON.parse(savedStickers);
        setStickers(parsedStickers);
        console.log('🎁 Loaded stickers from localStorage:', parsedStickers.length, 'stickers');
      } catch (error) {
        console.error('Error loading stickers from localStorage:', error);
        setStickers([]);
      }
    } else {
      console.log('🎁 No saved stickers found in localStorage');
    }
  }, []);

  // Save stickers to localStorage whenever stickers change
  useEffect(() => {
    if (stickers.length > 0) {
      localStorage.setItem('collectedStickers', JSON.stringify(stickers));
      console.log('💾 Saved stickers to localStorage:', stickers.length, 'stickers');
    }
  }, [stickers]);

  // Function to clear all stickers (useful for testing or resetting)
  const clearAllStickers = () => {
    setStickers([]);
    localStorage.removeItem('collectedStickers');
  };

  // Expose clear function to parent component if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.clearStickers = clearAllStickers;
    }
  }, []);

  // Generate random position within top 20% of farm image bounds
  const getRandomPosition = () => ({
    x: Math.random() * 70 + 15, // 15% to 85% of width
    y: Math.random() * 20, // 0% to 20% of height (top 20% only)
    rotation: (Math.random() - 0.5) * 10, // -5 to +5 degrees
  });

  // Show big sticker animation when isVisible becomes true
  useEffect(() => {
    if (isVisible) {
      setShowBigSticker(true);
      
      // After 1.5 seconds, hide big sticker and add to board
      const timer = setTimeout(() => {
        setShowBigSticker(false);
        
        // Add new sticker to the board
        const newSticker = {
          id: Date.now(),
          src: stickerSrc,
          ...getRandomPosition(),
        };
        
        setStickers(prev => [...prev, newSticker]);
        onAnimationComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, stickerSrc, onAnimationComplete]);

  return (
    <>
      {/* Big Centered Sticker Animation */}
      <AnimatePresence>
        {showBigSticker && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: [0.5, 1.2, 1],
            }}
            exit={{ 
              opacity: 0,
              scale: 0.3,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              scale: {
                times: [0, 0.6, 1],
                duration: 1.5,
              }
            }}
          >
            <motion.div
              className="w-40 h-40 relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
                ease: "easeInOut",
              }}
            >
              <img
                src={stickerSrc}
                alt="Reward Sticker"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              {/* Celebration particles */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                      y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.3,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticker Board - Transparent Overlay on Farm */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {stickers.map((sticker) => (
          <motion.div
            key={sticker.id}
            className="absolute w-24 h-24"
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `rotate(${sticker.rotation}deg)`,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.3,
              x: '50%',
              y: '50%',
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <img
              src={sticker.src}
              alt="Collected Sticker"
              className="w-full h-full object-contain drop-shadow-md hover:drop-shadow-lg transition-all duration-200"
            />
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default StickerReward;
