import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getProgress, 
  saveProgress, 
  getStickers, 
  saveStickers,
  completeAnimal,
  getAnimalLevelsCompleted,
  getAnimalVoiceFile,
  isAnimalAvailable,
  getLevelProgress,
  resetProgress
} from '../utils/progression';

const ProgressionContext = createContext();

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};

export const ProgressionProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => getProgress());
  const [stickers, setStickers] = useState(() => getStickers());
  const [allAnimals, setAllAnimals] = useState([]);

  // Load progress and stickers on mount
  useEffect(() => {
    setProgress(getProgress());
    setStickers(getStickers());
  }, []);

  // Load farm config to get all animals
  useEffect(() => {
    const loadFarmConfig = async () => {
      try {
        const response = await fetch('/config/farm.json');
        const data = await response.json();
        setAllAnimals(data.animals || []);
      } catch (error) {
        console.error('Error loading farm config:', error);
      }
    };
    
    loadFarmConfig();
  }, []);

  const completeAnimalForLevel = (animalId) => {
    const result = completeAnimal(animalId, allAnimals);
    setProgress(result.progress);
    
    // Update stickers if new ones were earned
    if (result.newStickers.length > 0) {
      setStickers(getStickers());
    }
    
    return result;
  };

  const getAnimalVoice = (animal, currentLanguage = 'en') => {
    return getAnimalVoiceFile(animal, currentLanguage);
  };

  const isAnimalUnlocked = (animalId) => {
    return isAnimalAvailable(animalId, allAnimals);
  };

  const getAnimalProgress = (animalId) => {
    return getAnimalLevelsCompleted(animalId);
  };

  const getCurrentLevelProgress = () => {
    return getLevelProgress(allAnimals);
  };

  const resetAllProgress = () => {
    const newProgress = resetProgress();
    setProgress(newProgress);
    setStickers([]);
    return newProgress;
  };

  const value = {
    // Progress state
    currentLevel: progress.currentLevel,
    completedAnimals: progress.completedAnimals,
    stickers,
    
    // Progress actions
    completeAnimal: completeAnimalForLevel,
    getAnimalVoice,
    isAnimalUnlocked,
    getAnimalProgress,
    getCurrentLevelProgress,
    resetAllProgress,
    
    // Utility
    allAnimals
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
};
