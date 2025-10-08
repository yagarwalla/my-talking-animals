import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Animal from './Animal';
import ProgressionUI from './ProgressionUI';
import StickerReward from './StickerReward';
import { useProgression } from '../contexts/ProgressionContext.jsx';

const AreaScreen = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [farmConfig, setFarmConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showStickerReward, setShowStickerReward] = useState(false);
  const [currentStickerSrc, setCurrentStickerSrc] = useState('');
  
  // Get current level from progression context
  const { currentLevel } = useProgression();

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

  // Debug: Log layout dimensions and spacing for AreaScreen
  useEffect(() => {
    const logAreaLayoutInfo = () => {
      const areaScreen = document.querySelector('.area-screen');
      const areaContent = document.querySelector('.area-content');
      const areaScene = document.querySelector('.area-scene');
      const backButtonContainer = document.querySelector('.area-screen .text-center');
      const backButton = document.querySelector('.area-screen .text-center button');
      
      console.log('🔍 AREA SCREEN SPACING DEBUG:');
      
      if (areaScreen) {
        const screenRect = areaScreen.getBoundingClientRect();
        const screenStyles = window.getComputedStyle(areaScreen);
        console.log('📐 Area Screen Container:', {
          element: 'area-screen',
          rect: screenRect,
          padding: screenStyles.padding,
          margin: screenStyles.margin,
          width: screenStyles.width,
          height: screenStyles.height,
          maxWidth: screenStyles.maxWidth,
          display: screenStyles.display,
          flexDirection: screenStyles.flexDirection,
          alignItems: screenStyles.alignItems,
          justifyContent: screenStyles.justifyContent
        });
      }
      
      if (areaContent) {
        const contentRect = areaContent.getBoundingClientRect();
        const contentStyles = window.getComputedStyle(areaContent);
        console.log('📐 Area Content:', {
          element: 'area-content',
          rect: contentRect,
          padding: contentStyles.padding,
          margin: contentStyles.margin,
          marginTop: contentStyles.marginTop,
          marginBottom: contentStyles.marginBottom,
          width: contentStyles.width,
          height: contentStyles.height,
          display: contentStyles.display,
          flexDirection: contentStyles.flexDirection,
          alignItems: contentStyles.alignItems,
          justifyContent: contentStyles.justifyContent
        });
      }
      
      if (areaScene) {
        const sceneRect = areaScene.getBoundingClientRect();
        const sceneStyles = window.getComputedStyle(areaScene);
        console.log('📐 Area Scene:', {
          element: 'area-scene',
          rect: sceneRect,
          padding: sceneStyles.padding,
          margin: sceneStyles.margin,
          width: sceneStyles.width,
          height: sceneStyles.height,
          maxWidth: sceneStyles.maxWidth
        });
      }
      
      if (backButtonContainer) {
        const buttonContainerRect = backButtonContainer.getBoundingClientRect();
        const buttonContainerStyles = window.getComputedStyle(backButtonContainer);
        console.log('📐 Back Button Container:', {
          element: 'back-button-container',
          rect: buttonContainerRect,
          padding: buttonContainerStyles.padding,
          margin: buttonContainerStyles.margin,
          marginTop: buttonContainerStyles.marginTop,
          className: buttonContainerStyles.className
        });
      }
      
      if (backButton) {
        const buttonRect = backButton.getBoundingClientRect();
        const buttonStyles = window.getComputedStyle(backButton);
        console.log('📐 Back Button:', {
          element: 'back-button',
          rect: buttonRect,
          padding: buttonStyles.padding,
          margin: buttonStyles.margin,
          marginTop: buttonStyles.marginTop
        });
      }
      
      // Calculate spacing between elements
      if (areaScene && backButtonContainer) {
        const sceneRect = areaScene.getBoundingClientRect();
        const buttonContainerRect = backButtonContainer.getBoundingClientRect();
        const spacing = buttonContainerRect.top - sceneRect.bottom;
        
        console.log('📏 AREA SPACING ANALYSIS:', {
          sceneBottom: sceneRect.bottom,
          buttonContainerTop: buttonContainerRect.top,
          spacingBetween: spacing,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          sceneHeight: sceneRect.height,
          buttonContainerHeight: buttonContainerRect.height
        });
        
        // Check for any elements between scene and button
        const allElements = document.querySelectorAll('*');
        const elementsBetween = [];
        
        allElements.forEach(el => {
          const elRect = el.getBoundingClientRect();
          if (elRect.top > sceneRect.bottom && elRect.bottom < buttonContainerRect.top) {
            const styles = window.getComputedStyle(el);
            if (styles.height !== '0px' && styles.height !== 'auto' && 
                (parseFloat(styles.height) > 0 || elRect.height > 0)) {
              elementsBetween.push({
                element: el.tagName,
                className: el.className,
                height: elRect.height,
                marginTop: styles.marginTop,
                marginBottom: styles.marginBottom,
                paddingTop: styles.paddingTop,
                paddingBottom: styles.paddingBottom
              });
            }
          }
        });
        
        console.log('📏 Elements between scene and button:', elementsBetween);
      }
    };
    
    // Only log if not loading and no error
    if (!loading && !error) {
      // Log immediately and on resize
      logAreaLayoutInfo();
      window.addEventListener('resize', logAreaLayoutInfo);
      
      return () => window.removeEventListener('resize', logAreaLayoutInfo);
    }
  }, [farmConfig, loading, error]);


  const handleBackToMap = () => {
    navigate('/map');
  };

  // Function to trigger sticker reward (can be called when level is completed)
  const triggerStickerReward = (stickerSrc) => {
    setCurrentStickerSrc(stickerSrc);
    setShowStickerReward(true);
  };

  // Handle sticker animation completion
  const handleStickerAnimationComplete = () => {
    setShowStickerReward(false);
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
      {/* Progression UI */}
      {areaInfo.hasConfig && farmConfig && <ProgressionUI />}
      
      <div className="area-content">
        <h1 className="area-title">{areaInfo.name}</h1>
        <p className="area-description">{areaInfo.description}</p>
        {areaInfo.hasConfig && farmConfig ? (
          <div className="area-scene">
            {/* Background Image with Sticker Board */}
            <div className="area-background-container relative">
              <img
                src={`/${farmConfig.background}`}
                alt={`${areaInfo.name} Background`}
                className="area-background-image"
                onError={(e) => {
                  console.error('Failed to load background image:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Sticker Reward System */}
              <StickerReward 
                isVisible={showStickerReward}
                stickerSrc={currentStickerSrc}
                onAnimationComplete={handleStickerAnimationComplete}
                currentLevel={currentLevel}
              />
              
              {/* Animal Components - Now positioned relative to the background container */}
              {farmConfig.animals.map((animal, index) => (
                <Animal
                  key={animal.id}
                  animal={animal}
                  currentLanguage={currentLanguage}
                  index={index}
                  totalAnimals={farmConfig.animals.length}
                  onStickerReward={triggerStickerReward}
                />
              ))}
            </div>

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

      <div className="text-center mt-6">
        <motion.button
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-large hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
          onClick={handleBackToMap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">←</span>
          {currentLanguage === 'hi' ? 'मानचित्र पर वापस जाएं' : 'Back to Map'}
        </motion.button>
      </div>
    </div>
  );
};

export default AreaScreen; 