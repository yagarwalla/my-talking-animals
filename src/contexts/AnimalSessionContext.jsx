import React, { createContext, useContext, useState } from 'react';

const AnimalSessionContext = createContext(undefined);

export const useAnimalSession = () => {
  const context = useContext(AnimalSessionContext);
  if (!context) {
    throw new Error('useAnimalSession must be used within an AnimalSessionProvider');
  }
  return context;
};

export const AnimalSessionProvider = ({ children }) => {
  const [sessionState, setSessionState] = useState({
    animalInteractions: {},
    totalInteractions: 0,
    sessionStartTime: Date.now()
  });

  const recordAnimalInteraction = (animalId, templateId) => {
    setSessionState(prevState => {
      const existingInteraction = prevState.animalInteractions[animalId];
      
      const updatedInteraction = {
        animalId,
        usedTemplates: existingInteraction 
          ? [...existingInteraction.usedTemplates, templateId]
          : [templateId],
        lastInteractionTime: Date.now()
      };

      return {
        ...prevState,
        animalInteractions: {
          ...prevState.animalInteractions,
          [animalId]: updatedInteraction
        },
        totalInteractions: prevState.totalInteractions + 1
      };
    });
  };

  const getUsedTemplatesForAnimal = (animalId) => {
    return sessionState.animalInteractions[animalId]?.usedTemplates || [];
  };

  const resetSession = () => {
    setSessionState({
      animalInteractions: {},
      totalInteractions: 0,
      sessionStartTime: Date.now()
    });
  };

  const hasInteractedWithAnimal = (animalId) => {
    return !!sessionState.animalInteractions[animalId];
  };

  const value = {
    sessionState,
    recordAnimalInteraction,
    getUsedTemplatesForAnimal,
    resetSession,
    hasInteractedWithAnimal
  };

  return (
    <AnimalSessionContext.Provider value={value}>
      {children}
    </AnimalSessionContext.Provider>
  );
};

