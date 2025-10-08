import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LandscapeEnforcer = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOrientation = () => {
      // Check if device is in portrait mode
      const isPortraitMode = window.innerHeight > window.innerWidth;
      setIsPortrait(isPortraitMode);
    };

    // Check on mount
    checkOrientation();

    // Check on resize and orientation change
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Pages where portrait mode is allowed (landing page and profile selection)
  const portraitAllowedPages = ['/', '/play', '/demo', '/animal-demo', '/template-demo'];
  
  // Check if current page allows portrait mode (exact match only)
  const isPortraitAllowed = portraitAllowedPages.includes(location.pathname);

  // Debug logging
  console.log('🔍 LandscapeEnforcer Debug:', {
    currentPath: location.pathname,
    isPortrait,
    windowWidth: window.innerWidth,
    isPortraitAllowed,
    portraitAllowedPages,
    shouldShowEnforcer: isPortrait && window.innerWidth <= 1024 && !isPortraitAllowed
  });

  // Only show enforcer on mobile/tablet devices in portrait mode AND when portrait is not allowed
  if (!isPortrait || window.innerWidth > 1024 || isPortraitAllowed) {
    return null;
  }

  return (
    <div className="landscape-enforcer">
      <div className="enforcer-content">
        <div className="device-icon">📱</div>
        <h1>Please Rotate Your Device</h1>
        <p>This app works best in landscape mode on mobile and tablet devices.</p>
        <div className="rotate-icon">🔄</div>
        <p>Please rotate your device to landscape orientation to continue.</p>
        <div className="device-icon">💻</div>
      </div>
    </div>
  );
};

export default LandscapeEnforcer;
