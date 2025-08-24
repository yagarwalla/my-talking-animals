import React, { useState, useEffect } from 'react';

const LandscapeEnforcer = () => {
  const [isPortrait, setIsPortrait] = useState(false);

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

  // Only show enforcer on mobile/tablet devices in portrait mode
  if (!isPortrait || window.innerWidth > 1024) {
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
