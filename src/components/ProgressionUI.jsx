import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../contexts/ProgressionContext';

const ProgressionUI = () => {
  const { 
    currentLevel, 
    stickers, 
    getCurrentLevelProgress
  } = useProgression();
  
  const [showStickers, setShowStickers] = useState(false);
  
  const levelProgress = getCurrentLevelProgress();
  
  // Sticker definitions
  const stickerDefinitions = {
    'farm_level1_expert': { name: 'Farm Expert Level 1', emoji: '🏆', description: 'Completed all animals in Level 1' },
    'farm_level2_expert': { name: 'Farm Expert Level 2', emoji: '🥇', description: 'Completed all animals in Level 2' },
    'farm_level3_expert': { name: 'Farm Expert Level 3', emoji: '👑', description: 'Completed all animals in Level 3' },
    'farm_level4_expert': { name: 'Farm Expert Level 4', emoji: '💎', description: 'Completed all animals in Level 4' },
    'farm_level5_expert': { name: 'Farm Expert Level 5', emoji: '🌟', description: 'Completed all animals in Level 5' },
    'cow_expert': { name: 'Cow Expert', emoji: '🐮', description: 'Completed all 5 levels for Cow' },
    'pig_expert': { name: 'Pig Expert', emoji: '🐷', description: 'Completed all 5 levels for Pig' },
    'goat_expert': { name: 'Goat Expert', emoji: '🐐', description: 'Completed all 5 levels for Goat' },
    'sheep_expert': { name: 'Sheep Expert', emoji: '🐑', description: 'Completed all 5 levels for Sheep' },
    'hen_expert': { name: 'Hen Expert', emoji: '🐔', description: 'Completed all 5 levels for Hen' },
    'horse_expert': { name: 'Horse Expert', emoji: '🐴', description: 'Completed all 5 levels for Horse' }
  };
  
  return (
    <div className="progression-ui fixed top-20 right-4 z-40">
      {/* Level Progress */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg mb-4"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">Level {currentLevel}</h3>
          <button
            onClick={() => setShowStickers(!showStickers)}
            className="text-2xl hover:scale-110 transition-transform"
            title="View Stickers"
          >
            🏆
          </button>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{levelProgress.completed}/{levelProgress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress.percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          {levelProgress.completed === levelProgress.total 
            ? "Level Complete! 🎉" 
            : `${levelProgress.total - levelProgress.completed} more to go`
          }
        </div>
      </motion.div>
      
      {/* Stickers Modal */}
      <AnimatePresence>
        {showStickers && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStickers(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Your Stickers</h2>
                <button
                  onClick={() => setShowStickers(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {stickers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">🏆</div>
                  <p>No stickers yet!</p>
                  <p className="text-sm">Complete levels to earn stickers</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {stickers.map((stickerId) => {
                    const sticker = stickerDefinitions[stickerId];
                    return sticker ? (
                      <motion.div
                        key={stickerId}
                        className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4 text-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: stickers.indexOf(stickerId) * 0.1 }}
                      >
                        <div className="text-3xl mb-2">{sticker.emoji}</div>
                        <div className="font-bold text-sm text-gray-800 mb-1">
                          {sticker.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {sticker.description}
                        </div>
                      </motion.div>
                    ) : null;
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressionUI;
