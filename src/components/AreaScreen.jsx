import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AreaScreen = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();

  // Area information
  const areaInfo = {
    farm: {
      name: 'Farm',
      description: 'Welcome to the farm! Meet our friendly farm animals.',
      animals: ['🐄', '🐷', '🐑', '🐔', '🦆'],
      color: '#8FBC8F'
    },
    forest: {
      name: 'Forest',
      description: 'Explore the magical forest and discover wild animals.',
      animals: ['🦊', '🐻', '🦌', '🐰', '🦉'],
      color: '#228B22'
    },
    lake: {
      name: 'Lake',
      description: 'Dive into the lake and swim with aquatic creatures.',
      animals: ['🐟', '🐢', '🦢', '🦆', '🐸'],
      color: '#4682B4'
    },
    mountain: {
      name: 'Mountain',
      description: 'Climb the mountain and meet mountain animals.',
      animals: ['🐐', '🦅', '🐻', '🦊', '🦌'],
      color: '#696969'
    }
  };

  const currentArea = areaInfo[areaId] || {
    name: 'Unknown Area',
    description: 'This area is still being explored.',
    animals: ['❓'],
    color: '#999'
  };

  return (
    <motion.div 
      className="area-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: currentArea.color }}
    >
      <div className="area-header">
        <motion.button
          className="back-button"
          onClick={() => navigate('/map')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Map
        </motion.button>
        
        <motion.h1 
          className="area-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentArea.name}
        </motion.h1>
      </div>

      <div className="area-content">
        <motion.div 
          className="area-description"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>{currentArea.description}</p>
        </motion.div>

        <motion.div 
          className="animals-grid"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Animals you can meet:</h2>
          <div className="animals-list">
            {currentArea.animals.map((animal, index) => (
              <motion.div
                key={index}
                className="animal-item"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="animal-emoji">{animal}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="coming-soon"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>🎮 Interactive features coming soon!</p>
          <p>Learn animal sounds, names, and more!</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AreaScreen; 