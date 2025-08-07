import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Map = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');
    if (!savedProfile) {
      navigate('/');
      return;
    }

    try {
      const profileData = JSON.parse(savedProfile);
      setProfile(profileData);
    } catch (error) {
      console.error('Error parsing profile:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleBackToProfile = () => {
    localStorage.removeItem('profile');
    navigate('/');
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
      </div>
      
      <div className="map-content">
        <h2>Map Screen</h2>
        <p>This is where the interactive map will be displayed.</p>
        <p>Your child's profile has been saved successfully!</p>
      </div>

      <button onClick={handleBackToProfile} className="back-button">
        Back to Profile Setup
      </button>
    </div>
  );
};

export default Map; 