import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Animal from './Animal';

const AreaScreen = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [farmConfig, setFarmConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load farm configuration from JSON
  useEffect(() => {
    const loadFarmConfig = async () => {
      if (areaId === 'farm') {
        try {
          setLoading(true);
          const response = await fetch('/config/farm.json');
          if (!response.ok) {
            throw new Error('Failed to load farm configuration');
          }
          const config = await response.json();
          setFarmConfig(config);
        } catch (err) {
          console.error('Error loading farm config:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadFarmConfig();
  }, [areaId]);

  // Get current profile language preference
  useEffect(() => {
    const currentProfile = localStorage.getItem('currentProfile');
    if (currentProfile) {
      try {
        const profile = JSON.parse(currentProfile);
        setCurrentLanguage(profile.primaryLanguage === 'Hindi' ? 'hi' : 'en');
      } catch (err) {
        console.error('Error parsing profile:', err);
      }
    }
  }, []);

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal);
    
    // Auto-hide info panel after 5 seconds
    setTimeout(() => {
      setSelectedAnimal(null);
    }, 5000);
  };

  const handleBackToMap = () => {
    navigate('/map');
  };

  const getAreaInfo = () => {
    switch (areaId) {
      case 'farm':
        return {
          name: currentLanguage === 'hi' ? 'खेत' : 'Farm',
          description: currentLanguage === 'hi' 
            ? 'खेत में आपका स्वागत है! हमारे दोस्ताना जानवरों से मिलें।'
            : 'Welcome to the farm! Meet our friendly animals.',
          hasConfig: true
        };
      case 'forest':
        return {
          name: currentLanguage === 'hi' ? 'जंगल' : 'Forest',
          description: currentLanguage === 'hi' 
            ? 'रहस्यमय जंगल का अन्वेषण करें!'
            : 'Explore the mysterious forest!',
          hasConfig: false
        };
      case 'lake':
        return {
          name: currentLanguage === 'hi' ? 'झील' : 'Lake',
          description: currentLanguage === 'hi' 
            ? 'ठंडी झील में गोता लगाएं!'
            : 'Dive into the cool lake!',
          hasConfig: false
        };
      case 'mountain':
        return {
          name: currentLanguage === 'hi' ? 'पहाड़' : 'Mountain',
          description: currentLanguage === 'hi' 
            ? 'नई ऊंचाइयों पर चढ़ें!'
            : 'Climb to new heights!',
          hasConfig: false
        };
      default:
        return {
          name: currentLanguage === 'hi' ? 'अज्ञात क्षेत्र' : 'Unknown Area',
          description: currentLanguage === 'hi' 
            ? 'यह क्षेत्र अभी भी खोजा जा रहा है!'
            : 'This area is still being explored!',
          hasConfig: false
        };
    }
  };

  const areaInfo = getAreaInfo();

  if (loading) {
    return (
      <div className="area-screen">
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading farm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="area-screen">
        <div className="error-container">
          <h2>Error Loading Farm</h2>
          <p>{error}</p>
          <button onClick={handleBackToMap}>Back to Map</button>
        </div>
      </div>
    );
  }

  return (
    <div className="area-screen">
      <div className="area-header">
        <h1 className="area-title">{areaInfo.name}</h1>
        <p className="area-description">{areaInfo.description}</p>
        

      </div>

      <div className="area-content">
        {areaInfo.hasConfig && farmConfig ? (
          <div className="area-scene">
            {/* Background Image */}
            <div className="area-background-container">
              <img
                src={`/${farmConfig.background}`}
                alt={`${areaInfo.name} Background`}
                className="area-background-image"
                onError={(e) => {
                  console.error('Failed to load background image:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Animal Components */}
            {farmConfig.animals.map((animal) => (
              <Animal
                key={animal.id}
                animal={animal}
                onAnimalClick={handleAnimalClick}
                currentLanguage={currentLanguage}
              />
            ))}

            {/* Animal Info Panel */}
            {selectedAnimal && (
              <motion.div
                className="animal-info-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h3>{selectedAnimal.name[currentLanguage] || selectedAnimal.name.en}</h3>
                <div className="animal-sound">
                  <span className="sound-icon">🔊</span>
                  <span className="sound-text">
                    {currentLanguage === 'hi' ? 'ध्वनि चल रही है!' : 'Playing sound!'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="coming-soon">
            <div className="coming-soon-icon">🚧</div>
            <h2>{currentLanguage === 'hi' ? 'जल्द आ रहा है!' : 'Coming Soon!'}</h2>
            <p>
              {currentLanguage === 'hi' 
                ? 'यह क्षेत्र अभी भी निर्माणाधीन है। बाद में वापस जांचें!'
                : 'This area is still under construction. Check back later!'
              }
            </p>
          </div>
        )}
      </div>

      <motion.button
        className="back-button"
        onClick={handleBackToMap}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← {currentLanguage === 'hi' ? 'मानचित्र पर वापस जाएं' : 'Back to Map'}
      </motion.button>
    </div>
  );
};

export default AreaScreen; 