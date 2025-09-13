import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressionContext = createContext(undefined);

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};

export const ProgressionProvider = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedAnimals, setCompletedAnimals] = useState(new Set());
  const [stickers, setStickers] = useState([]);
  const [allAnimals] = useState(['cow', 'pig', 'goat', 'sheep', 'hen', 'horse']);
  const [speakingAnimal, setSpeakingAnimal] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progression data from localStorage on mount
  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem('progression_level');
      const savedCompleted = localStorage.getItem('progression_completed');
      const savedStickers = localStorage.getItem('progression_stickers');

      console.log('🔄 Loading progression data from localStorage:', {
        savedLevel,
        savedCompleted,
        savedStickers
      });

      if (savedLevel) {
        setCurrentLevel(parseInt(savedLevel));
        console.log('✅ Loaded level:', savedLevel);
      }
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        setCompletedAnimals(Array.isArray(parsed) ? new Set(parsed) : new Set());
        console.log('✅ Loaded completed animals:', parsed);
      }
      if (savedStickers) {
        const parsed = JSON.parse(savedStickers);
        setStickers(Array.isArray(parsed) ? parsed : []);
        console.log('✅ Loaded stickers:', parsed);
      }
      
      // Mark as initialized after loading is complete
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error loading progression data from localStorage:', error);
      // Reset to defaults on error
      setCurrentLevel(1);
      setCompletedAnimals(new Set());
      setStickers([]);
      setIsInitialized(true);
    }
  }, []);

  // Save progression data to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) {
      console.log('⏳ Skipping save - not yet initialized');
      return;
    }
    
    console.log('💾 Saving progression data to localStorage:', {
      currentLevel,
      completedAnimals: [...completedAnimals],
      stickers
    });
    
    localStorage.setItem('progression_level', currentLevel.toString());
    localStorage.setItem('progression_completed', JSON.stringify([...completedAnimals]));
    localStorage.setItem('progression_stickers', JSON.stringify(stickers));
  }, [currentLevel, completedAnimals, stickers, isInitialized]);

  const completeAnimal = (animalId, onComplete = null) => {
    if (completedAnimals.has(animalId)) {
      return { success: false, message: 'Animal already completed' };
    }

    const newCompleted = new Set(completedAnimals);
    newCompleted.add(animalId);
    setCompletedAnimals(newCompleted);

    // Check if all animals are completed for current level
    const isLevelComplete = allAnimals.every(animal => newCompleted.has(animal));
    
    let levelUp = false;
    let newStickers = [];

    if (isLevelComplete) {
      // Level up
      setCurrentLevel(prev => prev + 1);
      levelUp = true;

      // Award level completion sticker (for the level that was just completed)
      const levelStickerId = `farm_level${currentLevel}_expert`;
      const currentStickers = Array.isArray(stickers) ? stickers : [];
      if (!currentStickers.includes(levelStickerId)) {
        newStickers = [...currentStickers, levelStickerId];
        setStickers(newStickers);
      }

      // Reset completed animals for next level
      setCompletedAnimals(new Set());
    }

    // Award individual animal expert sticker if all 5 levels completed
    const animalStickerId = `${animalId}_expert`;
    const currentStickers = Array.isArray(stickers) ? stickers : [];
    if (!currentStickers.includes(animalStickerId)) {
      // For now, we'll award the sticker after completing the animal once
      // In a full system, this would check if all 5 levels are completed
      newStickers = [...newStickers, animalStickerId];
      setStickers(newStickers);
    }

    const result = {
      success: true,
      levelUp,
      newStickers,
      progress: {
        currentLevel,
        completed: newCompleted.size,
        total: allAnimals.length
      }
    };

    // Call the completion callback if provided
    if (onComplete) {
      try {
        onComplete(result);
      } catch (callbackError) {
        console.error(`Error in onComplete callback for ${animalId}:`, callbackError);
      }
    }

    return result;
  };

  const getCurrentLevelProgress = () => {
    const completed = completedAnimals.size;
    const total = allAnimals.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      total,
      percentage
    };
  };

  const isAnimalUnlocked = (animalId) => {
    // For now, all animals are unlocked at level 1
    return currentLevel >= 1;
  };

  const getAnimalVoice = (animal, language) => {
    // Return the level 1 voice file for the current language
    if (animal.levels && animal.levels.length > 0) {
      const level1Voice = animal.levels.find(level => 
        level.id === 1 && 
        level.direction === (language === 'en' ? 'en-hi' : 'hi-en')
      );
      return level1Voice ? level1Voice.voice : null;
    }
    return null;
  };

  const getAnimalProgress = (animalId) => {
    return {
      completed: completedAnimals.has(animalId),
      level: currentLevel
    };
  };

  const resetProgression = () => {
    setCurrentLevel(1);
    setCompletedAnimals(new Set());
    setStickers([]);
  };

  const setAnimalSpeaking = (animalId) => {
    setSpeakingAnimal(animalId);
  };

  const setAnimalFinishedSpeaking = () => {
    setSpeakingAnimal(null);
  };

  const isAnimalSpeaking = (animalId) => {
    return speakingAnimal === animalId;
  };

  const isAnyAnimalSpeaking = () => {
    return speakingAnimal !== null;
  };

  const value = {
    currentLevel,
    completedAnimals,
    stickers,
    allAnimals,
    completeAnimal,
    getCurrentLevelProgress,
    isAnimalUnlocked,
    getAnimalVoice,
    getAnimalProgress,
    resetProgression,
    setAnimalSpeaking,
    setAnimalFinishedSpeaking,
    isAnimalSpeaking,
    isAnyAnimalSpeaking
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
};

export default ProgressionContext;