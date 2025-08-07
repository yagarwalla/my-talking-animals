import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSelector = () => {
  const [profiles, setProfiles] = useState([]);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [kidName, setKidName] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');
  const [secondaryLanguage, setSecondaryLanguage] = useState('Hindi');
  const navigate = useNavigate();

  // Load existing profiles on component mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        console.error('Error loading profiles:', error);
        setProfiles([]);
      }
    }
  };

  const saveProfiles = (newProfiles) => {
    localStorage.setItem('profiles', JSON.stringify(newProfiles));
    setProfiles(newProfiles);
  };

  const handleCreateNewProfile = () => {
    if (!kidName.trim()) {
      alert('Please enter your child\'s name');
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      kidName: kidName.trim(),
      primaryLanguage,
      secondaryLanguage,
      createdAt: new Date().toISOString()
    };

    const updatedProfiles = [...profiles, newProfile];
    saveProfiles(updatedProfiles);

    // Set as current profile and navigate
    localStorage.setItem('currentProfile', JSON.stringify(newProfile));
    navigate('/map');
  };

  const handleSelectProfile = (profile) => {
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    navigate('/map');
  };

  const handleDeleteProfile = (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
      saveProfiles(updatedProfiles);
      
      // If the deleted profile was the current one, clear current profile
      const currentProfile = localStorage.getItem('currentProfile');
      if (currentProfile) {
        try {
          const current = JSON.parse(currentProfile);
          if (current.id === profileId) {
            localStorage.removeItem('currentProfile');
          }
        } catch (error) {
          console.error('Error parsing current profile:', error);
        }
      }
    }
  };

  const handleStartNewProfile = () => {
    setShowNewProfileForm(true);
    setKidName('');
    setPrimaryLanguage('English');
    setSecondaryLanguage('Hindi');
  };

  const handleCancelNewProfile = () => {
    setShowNewProfileForm(false);
    setKidName('');
  };

  return (
    <div className="profile-selector">
      <div className="profile-container">
        <h1 className="profile-title">My Talking Animals</h1>
        <p className="profile-subtitle">Choose a profile or create a new one</p>
        
        {!showNewProfileForm ? (
          // Profile Selection View
          <div className="profile-selection">
            {profiles.length > 0 ? (
              <div className="existing-profiles">
                <h2 className="section-title">Existing Profiles</h2>
                <div className="profiles-grid">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="profile-card">
                      <div className="profile-info">
                        <h3 className="profile-name">{profile.kidName}</h3>
                        <p className="profile-languages">
                          {profile.primaryLanguage} • {profile.secondaryLanguage}
                        </p>
                        <p className="profile-date">
                          Created: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="profile-actions">
                        <button
                          onClick={() => handleSelectProfile(profile)}
                          className="select-button"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-profiles">
                <p>No profiles found. Create your first profile to get started!</p>
              </div>
            )}
            
            <button
              onClick={handleStartNewProfile}
              className="new-profile-button"
            >
              + Create New Profile
            </button>
          </div>
        ) : (
          // New Profile Form
          <div className="profile-form">
            <h2 className="section-title">Create New Profile</h2>
            
            <div className="form-group">
              <label htmlFor="kidName" className="form-label">
                What's your child's name?
              </label>
              <input
                type="text"
                id="kidName"
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                placeholder="Enter your child's name"
                className="form-input"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Language</label>
              <div className="language-options">
                <label className="language-option">
                  <input
                    type="radio"
                    name="primaryLanguage"
                    value="English"
                    checked={primaryLanguage === 'English'}
                    onChange={(e) => setPrimaryLanguage(e.target.value)}
                  />
                  <span className="language-text">English</span>
                </label>
                <label className="language-option">
                  <input
                    type="radio"
                    name="primaryLanguage"
                    value="Hindi"
                    checked={primaryLanguage === 'Hindi'}
                    onChange={(e) => setPrimaryLanguage(e.target.value)}
                  />
                  <span className="language-text">Hindi</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Language</label>
              <div className="language-options">
                <label className="language-option">
                  <input
                    type="radio"
                    name="secondaryLanguage"
                    value="English"
                    checked={secondaryLanguage === 'English'}
                    onChange={(e) => setSecondaryLanguage(e.target.value)}
                  />
                  <span className="language-text">English</span>
                </label>
                <label className="language-option">
                  <input
                    type="radio"
                    name="secondaryLanguage"
                    value="Hindi"
                    checked={secondaryLanguage === 'Hindi'}
                    onChange={(e) => setSecondaryLanguage(e.target.value)}
                  />
                  <span className="language-text">Hindi</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                onClick={handleCreateNewProfile}
                className="start-button"
                disabled={!kidName.trim()}
              >
                Create Profile
              </button>
              <button
                onClick={handleCancelNewProfile}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector; 