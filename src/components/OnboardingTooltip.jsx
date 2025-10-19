import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingTooltip = ({ children, message, position = 'top', show = false, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleComplete = () => {
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-white';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-white';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-white';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-white';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-white';
    }
  };

  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`absolute z-50 ${getPositionClasses()}`}
          >
            <div className="bg-white rounded-lg shadow-xl border-2 border-purple-200 p-4 max-w-xs">
              <div className="flex items-start gap-3">
                <div className="text-2xl">👆</div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">
                    {message}
                  </p>
                  <button
                    onClick={handleComplete}
                    className="mt-2 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full transition-colors"
                  >
                    Got it! ✨
                  </button>
                </div>
              </div>
              {/* Arrow */}
              <div className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingTooltip;
