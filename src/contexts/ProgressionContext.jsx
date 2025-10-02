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
  const [currentProfileId, setCurrentProfileId] = useState(null);

  // Get current profile ID
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

  // Load progression data from localStorage on mount
  useEffect(() => {
    const profileId = getCurrentProfileId();
    setCurrentProfileId(profileId);
    loadProfileData(profileId);
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
    
    if (currentProfileId) {
      localStorage.setItem(`progression_level_${currentProfileId}`, currentLevel.toString());
      localStorage.setItem(`progression_completed_${currentProfileId}`, JSON.stringify([...completedAnimals]));
      localStorage.setItem(`progression_stickers_${currentProfileId}`, JSON.stringify(stickers));
    }
  }, [currentLevel, completedAnimals, stickers, isInitialized, currentProfileId]);

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

    if (isLevelComplete) {
      // Level up (cap at level 5)
      setCurrentLevel(prev => Math.min(prev + 1, 5));
      levelUp = true;

      // Reset completed animals for next level
      setCompletedAnimals(new Set());
    }

    // Note: Visual stickers are now handled by StickerReward component

    const result = {
      success: true,
      levelUp,
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

  // Reset progression when profile changes
  const resetForNewProfile = () => {
    setCurrentLevel(1);
    setCompletedAnimals(new Set());
    setStickers([]);
    setIsInitialized(true);
    console.log('🔄 Reset progression for new profile');
  };

  // Manual profile change trigger (for same-tab profile switches)
  const triggerProfileChange = () => {
    const newProfileId = getCurrentProfileId();
    if (newProfileId !== currentProfileId) {
      console.log('Manual profile change triggered from', currentProfileId, 'to', newProfileId);
      setCurrentProfileId(newProfileId);
      loadProfileData(newProfileId);
    }
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

  // Load progression data when profile changes
  const loadProfileData = (profileId) => {
    if (!profileId) {
      console.log('No profile ID provided, using default progression');
      setCurrentLevel(1);
      setCompletedAnimals(new Set());
      setStickers([]);
      setIsInitialized(true);
      return;
    }

    try {
      const savedLevel = localStorage.getItem(`progression_level_${profileId}`);
      const savedCompleted = localStorage.getItem(`progression_completed_${profileId}`);
      const savedStickers = localStorage.getItem(`progression_stickers_${profileId}`);

      console.log('🔄 Loading progression data for profile', profileId, ':', {
        savedLevel,
        savedCompleted,
        savedStickers
      });

      if (savedLevel) {
        const loadedLevel = parseInt(savedLevel);
        setCurrentLevel(Math.min(loadedLevel, 5));
        console.log('✅ Loaded level:', Math.min(loadedLevel, 5));
      } else {
        setCurrentLevel(1);
      }

      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        setCompletedAnimals(Array.isArray(parsed) ? new Set(parsed) : new Set());
        console.log('✅ Loaded completed animals:', parsed);
      } else {
        setCompletedAnimals(new Set());
      }

      if (savedStickers) {
        const parsed = JSON.parse(savedStickers);
        setStickers(Array.isArray(parsed) ? parsed : []);
        console.log('✅ Loaded stickers:', parsed);
      } else {
        setStickers([]);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error loading progression data for profile', profileId, ':', error);
      setCurrentLevel(1);
      setCompletedAnimals(new Set());
      setStickers([]);
      setIsInitialized(true);
    }
  };

  // Detect profile changes and load appropriate data
  useEffect(() => {
    const handleProfileChange = () => {
      const newProfileId = getCurrentProfileId();
      if (newProfileId !== currentProfileId) {
        console.log('Profile changed from', currentProfileId, 'to', newProfileId);
        setCurrentProfileId(newProfileId);
        loadProfileData(newProfileId);
      }
    };

    // Listen for storage changes (profile switches from other tabs)
    window.addEventListener('storage', handleProfileChange);
    
    // Also check on focus (in case profile was changed in another tab)
    window.addEventListener('focus', handleProfileChange);

    return () => {
      window.removeEventListener('storage', handleProfileChange);
      window.removeEventListener('focus', handleProfileChange);
    };
  }, [currentProfileId]);

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
    resetForNewProfile,
    triggerProfileChange,
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