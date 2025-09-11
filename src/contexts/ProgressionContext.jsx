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

  // Load progression data from localStorage on mount
  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem('progression_level');
      const savedCompleted = localStorage.getItem('progression_completed');
      const savedStickers = localStorage.getItem('progression_stickers');

      if (savedLevel) setCurrentLevel(parseInt(savedLevel));
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        setCompletedAnimals(Array.isArray(parsed) ? new Set(parsed) : new Set());
      }
      if (savedStickers) {
        const parsed = JSON.parse(savedStickers);
        setStickers(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading progression data from localStorage:', error);
      // Reset to defaults on error
      setCurrentLevel(1);
      setCompletedAnimals(new Set());
      setStickers([]);
    }
  }, []);

  // Save progression data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('progression_level', currentLevel.toString());
    localStorage.setItem('progression_completed', JSON.stringify([...completedAnimals]));
    localStorage.setItem('progression_stickers', JSON.stringify(stickers));
  }, [currentLevel, completedAnimals, stickers]);

  const completeAnimal = (animalId) => {
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

      // Award level completion sticker
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

    return {
      success: true,
      levelUp,
      newStickers,
      progress: {
        currentLevel,
        completed: newCompleted.size,
        total: allAnimals.length
      }
    };
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
        level.direction === (language === 'hi' ? 'en-hi' : 'hi-en')
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
    resetProgression
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
};

export default ProgressionContext;