import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickerReward = ({ 
  isVisible = false, 
  stickerSrc = '/animals/cow/cow_idle.png', 
  onAnimationComplete = () => {},
  currentLevel = 1
}) => {
  const [showBigSticker, setShowBigSticker] = useState(false);
  const [stickers, setStickers] = useState([]);
  const isAddingStickerRef = useRef(false);
  const currentAnimatingStickerRef = useRef(null);

  // Get current profile ID for profile-specific storage
  const getCurrentProfileId = () => {
    try {
      const currentProfile = localStorage.getItem('currentProfile');
      if (currentProfile) {
        const profile = JSON.parse(currentProfile);
        return profile.id;
      }
    } catch (error) {
      console.error('Error getting current profile:', error);
    }
    return null;
  };

  // Load stickers from localStorage on component mount
  useEffect(() => {
    const profileId = getCurrentProfileId();
    if (!profileId) {
      console.log('🎁 No current profile found, no stickers loaded');
      return;
    }

    const savedStickers = localStorage.getItem(`collectedStickers_${profileId}`);
    if (savedStickers) {
      try {
        const parsedStickers = JSON.parse(savedStickers);
        setStickers(parsedStickers);
        console.log('🎁 Loaded stickers for profile', profileId, ':', parsedStickers.length, 'stickers');
      } catch (error) {
        console.error('Error loading stickers from localStorage:', error);
        setStickers([]);
      }
    } else {
      console.log('🎁 No saved stickers found for profile', profileId);
    }
  }, []);

  // Clean and backfill stickers based on actual progression (only run once when currentLevel changes)
  useEffect(() => {
    const profileId = getCurrentProfileId();
    if (!profileId) return;

    // Add a delay to allow any current sticker animation to complete first
    const backfillTimer = setTimeout(() => {
      const savedStickers = localStorage.getItem(`collectedStickers_${profileId}`);
      let existingStickers = [];
      
      if (savedStickers) {
        try {
          existingStickers = JSON.parse(savedStickers);
        } catch (error) {
          console.error('Error parsing saved stickers for cleanup:', error);
          existingStickers = [];
        }
      }
      
      // Cap at level 5 (final level) - only allow stickers for levels 1-4
      const maxAllowedLevel = Math.min(currentLevel - 1, 4);
      
      // Clean up existing stickers - remove any that shouldn't be there
      const validStickers = existingStickers.filter(sticker => {
        // Check if this is a level sticker
        const levelMatch = sticker.src.match(/\/level(\d+)\/level\d+_sticker\.png$/);
        if (levelMatch) {
          const stickerLevel = parseInt(levelMatch[1]);
          // Only keep stickers for levels that have been completed (1 to maxAllowedLevel)
          return stickerLevel >= 1 && stickerLevel <= maxAllowedLevel;
        }
        // Keep non-level stickers (if any exist in the future)
        return true;
      });
      
      // Generate missing stickers for completed levels
      const newStickers = [];
      for (let level = 1; level <= maxAllowedLevel; level++) {
        const stickerSrc = `/animals/stickers/level${level}/level${level}_sticker.png`;
        
        // Skip if this is the sticker currently being animated
        if (currentAnimatingStickerRef.current === stickerSrc) {
          console.log('⏭️ Skipping backfill for currently animating sticker:', stickerSrc);
          continue;
        }
        
        // Check if this level sticker already exists
        const existingSticker = validStickers.find(sticker => sticker.src === stickerSrc);
        if (!existingSticker) {
          newStickers.push({
            id: `backfill-${level}-${Date.now()}`,
            src: stickerSrc,
            ...getRandomPosition(),
          });
        }
      }
      
      // Combine valid existing stickers with new ones
      const finalStickers = [...validStickers, ...newStickers];
      
      // Only update if there are changes
      if (finalStickers.length !== existingStickers.length || 
          finalStickers.some((sticker, index) => !existingStickers[index] || sticker.id !== existingStickers[index].id)) {
        setStickers(finalStickers);
        
        const removedCount = existingStickers.length - validStickers.length;
        const addedCount = newStickers.length;
        
        console.log('🧹 Cleaned stickers for profile', profileId, ':', {
          removed: removedCount,
          added: addedCount,
          total: finalStickers.length,
          maxAllowedLevel
        });
      }
    }, 5000); // 5 second delay to allow sticker animation to complete

    return () => clearTimeout(backfillTimer);
  }, [currentLevel]); // Removed 'stickers' dependency to prevent infinite loop

  // Save stickers to localStorage whenever stickers change
  useEffect(() => {
    const profileId = getCurrentProfileId();
    if (profileId && stickers.length > 0) {
      localStorage.setItem(`collectedStickers_${profileId}`, JSON.stringify(stickers));
      console.log('💾 Saved stickers for profile', profileId, ':', stickers.length, 'stickers');
    }
  }, [stickers]);

  // Function to clear all stickers (useful for testing or resetting)
  const clearAllStickers = useCallback(() => {
    const profileId = getCurrentProfileId();
    setStickers([]);
    if (profileId) {
      localStorage.removeItem(`collectedStickers_${profileId}`);
    }
    console.log('🗑️ Cleared all stickers from state and localStorage for profile', profileId);
  }, []);

  // Expose clear function to parent component if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.clearStickers = clearAllStickers;
    }
  }, [clearAllStickers]);

  // Generate random position within top area of farm image bounds
  // Use top 10% for small screens, top 20% for larger screens
  const getRandomPosition = () => {
    const isSmallScreen = window.innerWidth <= 1024;
    const maxYPercentage = isSmallScreen ? 10 : 20;
    
    return {
      x: Math.random() * 70 + 15, // 15% to 85% of width
      y: Math.random() * maxYPercentage, // 0% to 10% on small screens, 0% to 20% on larger screens
      rotation: (Math.random() - 0.5) * 10, // -5 to +5 degrees
    };
  };

  // Play applause sound
  const playApplause = () => {
    try {
      const audio = new Audio("/sounds/applause.mp3");
      audio.volume = 0.7; // Set volume to 70%
      audio.play().catch(error => {
        console.log('Could not play applause sound:', error);
      });
    } catch (error) {
      console.log('Error creating applause audio:', error);
    }
  };

  // Show big sticker animation when isVisible becomes true
  useEffect(() => {
    if (isVisible && !isAddingStickerRef.current) {
      // Prevent duplicate sticker additions (React 19 Strict Mode protection)
      isAddingStickerRef.current = true;
      
      // Mark this sticker as currently animating to prevent backfill from adding it
      currentAnimatingStickerRef.current = stickerSrc;
      console.log('🎬 Starting animation for sticker:', stickerSrc);
      
      setShowBigSticker(true);
      
      // Play applause sound immediately when sticker is awarded
      playApplause();
      
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
        
        // Reset the refs after a delay to allow future stickers
        setTimeout(() => {
          isAddingStickerRef.current = false;
          currentAnimatingStickerRef.current = null;
          console.log('✅ Animation complete, refs reset');
        }, 100);
      }, 1500);

      return () => {
        clearTimeout(timer);
        // Also reset refs on cleanup
        isAddingStickerRef.current = false;
        currentAnimatingStickerRef.current = null;
      };
    } else if (!isVisible) {
      // Reset refs when sticker reward is hidden
      isAddingStickerRef.current = false;
      currentAnimatingStickerRef.current = null;
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
