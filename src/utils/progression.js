// Progression system for animal learning levels
const PROGRESSION_KEY = 'animalLearningProgress';
const STICKERS_KEY = 'animalLearningStickers';

// Default progress structure
const defaultProgress = {
  currentLevel: 1,
  completedAnimals: [],
  stickers: []
};

// Get current progress from localStorage
export const getProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESSION_KEY);
    return stored ? JSON.parse(stored) : { ...defaultProgress };
  } catch (error) {
    console.error('Error loading progress:', error);
    return { ...defaultProgress };
  }
};

// Save progress to localStorage
export const saveProgress = (progress) => {
  try {
    localStorage.setItem(PROGRESSION_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Get stickers from localStorage
export const getStickers = () => {
  try {
    const stored = localStorage.getItem(STICKERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stickers:', error);
    return [];
  }
};

// Save stickers to localStorage
export const saveStickers = (stickers) => {
  try {
    localStorage.setItem(STICKERS_KEY, JSON.stringify(stickers));
  } catch (error) {
    console.error('Error saving stickers:', error);
  }
};

// Mark an animal as completed for the current level
export const completeAnimal = (animalId, allAnimals) => {
  const progress = getProgress();
  
  // Check if animal is already completed for this level
  if (progress.completedAnimals.includes(animalId)) {
    return { progress, levelUp: false, newStickers: [] };
  }
  
  // Add animal to completed list
  progress.completedAnimals.push(animalId);
  
  // Check if all animals are completed for this level
  const levelUp = progress.completedAnimals.length >= allAnimals.length;
  const newStickers = [];
  
  if (levelUp) {
    // Level up: increment level and reset completed animals
    progress.currentLevel += 1;
    progress.completedAnimals = [];
    
    // Award level completion sticker
    const levelSticker = `farm_level${progress.currentLevel - 1}_expert`;
    const stickers = getStickers();
    if (!stickers.includes(levelSticker)) {
      stickers.push(levelSticker);
      newStickers.push(levelSticker);
      saveStickers(stickers);
    }
  }
  
  // Check for animal expert sticker (all 5 levels completed for this animal)
  const animalLevelsCompleted = getAnimalLevelsCompleted(animalId);
  if (animalLevelsCompleted >= 5) {
    const animalSticker = `${animalId}_expert`;
    const stickers = getStickers();
    if (!stickers.includes(animalSticker)) {
      stickers.push(animalSticker);
      newStickers.push(animalSticker);
      saveStickers(stickers);
    }
  }
  
  saveProgress(progress);
  return { progress, levelUp, newStickers };
};

// Get how many levels an animal has completed
export const getAnimalLevelsCompleted = (animalId) => {
  const progress = getProgress();
  const currentLevel = progress.currentLevel;
  
  // If we're on level 1, check if animal is completed
  if (currentLevel === 1) {
    return progress.completedAnimals.includes(animalId) ? 1 : 0;
  }
  
  // For higher levels, count completed levels
  // This is a simplified calculation - in a real app you might track this more precisely
  return Math.min(currentLevel - 1, 5);
};

// Get the correct MP3 file for an animal at current level
export const getAnimalVoiceFile = (animal, currentLanguage = 'en') => {
  const progress = getProgress();
  const currentLevel = progress.currentLevel;
  
  // Determine direction based on current language
  const direction = currentLanguage === 'en' ? 'en-hi' : 'hi-en';
  
  // Find the matching level and direction
  const levelConfig = animal.levels?.find(
    level => level.id === currentLevel && level.direction === direction
  );
  
  return levelConfig?.voice || null;
};

// Check if an animal is available for the current level
export const isAnimalAvailable = (animalId, allAnimals) => {
  const progress = getProgress();
  const currentLevel = progress.currentLevel;
  
  // All animals are available from level 1
  if (currentLevel === 1) {
    return true;
  }
  
  // For higher levels, check if all animals from previous level are completed
  // This is a simplified check - in reality you might want more complex logic
  return true;
};

// Get level completion percentage
export const getLevelProgress = (allAnimals) => {
  const progress = getProgress();
  const completedCount = progress.completedAnimals.length;
  const totalCount = allAnimals.length;
  
  return {
    completed: completedCount,
    total: totalCount,
    percentage: Math.round((completedCount / totalCount) * 100)
  };
};

// Reset all progress (for testing/debugging)
export const resetProgress = () => {
  localStorage.removeItem(PROGRESSION_KEY);
  localStorage.removeItem(STICKERS_KEY);
  return { ...defaultProgress };
};
