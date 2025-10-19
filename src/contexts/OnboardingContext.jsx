import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const seen = localStorage.getItem('my-talking-animals-onboarding-seen');
    if (seen === 'true') {
      setHasSeenOnboarding(true);
    }
  }, []);

  const startOnboarding = () => {
    if (!hasSeenOnboarding) {
      setIsOnboardingActive(true);
      setCurrentStep(0);
    }
  };

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    setIsOnboardingActive(false);
    setCurrentStep(0);
    localStorage.setItem('my-talking-animals-onboarding-seen', 'true');
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const value = {
    hasSeenOnboarding,
    currentStep,
    isOnboardingActive,
    startOnboarding,
    completeOnboarding,
    nextStep,
    skipOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
