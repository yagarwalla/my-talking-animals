import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Map = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentProfile = localStorage.getItem('currentProfile');
    if (!currentProfile) {
      navigate('/');
      return;
    }

    try {
      const profileData = JSON.parse(currentProfile);
      setProfile(profileData);
    } catch (error) {
      console.error('Error parsing current profile:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleBackToProfile = () => {
    // Don't clear localStorage - just navigate back
    navigate('/');
  };

  const showRawData = () => {
    const rawData = localStorage.getItem('currentProfile');
    alert('Raw localStorage data:\n\n' + rawData);
  };

  const showAllProfiles = () => {
    const allProfiles = localStorage.getItem('profiles');
    alert('All profiles in localStorage:\n\n' + allProfiles);
  };

  if (!profile) {
    return (
      <div className="map-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>Welcome, {profile.kidName}! 🎉</h1>
        <p>Primary Language: {profile.primaryLanguage}</p>
        <p>Secondary Language: {profile.secondaryLanguage}</p>
        <p>Created: {new Date(profile.createdAt).toLocaleString()}</p>
      </div>
      
      <div className="map-content">
        <h2>Map Screen</h2>
        <p>This is where the interactive map will be displayed.</p>
        <p>Your child's profile has been loaded successfully!</p>
        
        {/* Debug Section */}
        <div className="debug-section">
          <h3>Debug: Current Profile Data</h3>
          <pre className="debug-data">
            {JSON.stringify(profile, null, 2)}
          </pre>
          <div className="debug-buttons">
            <button onClick={showRawData} className="debug-button">
              Show Current Profile Raw Data
            </button>
            <button onClick={showAllProfiles} className="debug-button secondary">
              Show All Profiles
            </button>
          </div>
        </div>
      </div>

      <button onClick={handleBackToProfile} className="back-button">
        Back to Profile Selection
      </button>
    </div>
  );
};

export default Map; 