import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSelector = () => {
  const [profiles, setProfiles] = useState([]);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [kidName, setKidName] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');
  const [secondaryLanguage, setSecondaryLanguage] = useState('Hindi');
  const navigate = useNavigate();

  // Kid-friendly emojis for profile icons
  const kidEmojis = ['🐶', '🐱', '🐰', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🦄', '🦋', '🐢', '🐬', '🦕', '🦖', '🐳', '🦒', '🦘', '🐨', '🐯'];

  // Load existing profiles on component mount
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
      try {
        const parsedProfiles = JSON.parse(savedProfiles);
        // Ensure each profile has an emoji
        const profilesWithEmojis = parsedProfiles.map(profile => ({
          ...profile,
          emoji: profile.emoji || getRandomEmoji(profile.id)
        }));
        setProfiles(profilesWithEmojis);
      } catch (error) {
        console.error('Error loading profiles:', error);
        setProfiles([]);
      }
    }
  };

  const getRandomEmoji = (id) => {
    // Use the profile ID to consistently get the same emoji for each profile
    const index = parseInt(id) % kidEmojis.length;
    return kidEmojis[index];
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

    if (primaryLanguage === secondaryLanguage) {
      alert('Primary and secondary languages must be different. Please select different languages.');
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      kidName: kidName.trim(),
      primaryLanguage,
      secondaryLanguage,
      createdAt: new Date().toISOString(),
      emoji: getRandomEmoji(Date.now().toString())
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
    setShowDeleteMenu(false);
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

  const handlePrimaryLanguageChange = (language) => {
    setPrimaryLanguage(language);
    // If secondary language is the same, change it to the other option
    if (language === secondaryLanguage) {
      setSecondaryLanguage(language === 'English' ? 'Hindi' : 'English');
    }
  };

  const handleSecondaryLanguageChange = (language) => {
    // Prevent selecting the same language as primary
    if (language === primaryLanguage) {
      alert('Secondary language must be different from primary language.');
      return;
    }
    setSecondaryLanguage(language);
  };

  const isFormValid = () => {
    return kidName.trim() && primaryLanguage !== secondaryLanguage;
  };

  return (
    <div className="profile-selector">
      <div className="profile-container">
        <h1 className="profile-title">My Talking Animals</h1>
        <p className="profile-subtitle">Choose your profile or create a new one!</p>
        
        {!showNewProfileForm ? (
          // Profile Selection View
          <div className="profile-selection">
            {profiles.length > 0 ? (
              <div className="existing-profiles">
                <div className="profiles-header">
                  <h2 className="section-title">Your Profiles</h2>
                  <button
                    onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                    className="menu-button"
                  >
                    {showDeleteMenu ? '✕' : '⚙️'}
                  </button>
                </div>
                <div className="profiles-grid">
                  {profiles.map((profile) => (
                    <div 
                      key={profile.id} 
                      className={`profile-card ${showDeleteMenu ? 'delete-mode' : ''}`}
                      onClick={() => showDeleteMenu ? handleDeleteProfile(profile.id) : handleSelectProfile(profile)}
                    >
                      <div className="profile-icon">
                        <span className="profile-emoji">{profile.emoji}</span>
                      </div>
                      <div className="profile-info">
                        <h3 className="profile-name">{profile.kidName}</h3>
                        <p className="profile-languages">
                          {profile.primaryLanguage} • {profile.secondaryLanguage}
                        </p>
                      </div>
                      {showDeleteMenu && (
                        <div className="delete-overlay">
                          <span className="delete-icon">🗑️</span>
                          <span className="delete-text">Delete</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {showDeleteMenu && (
                  <p className="delete-instruction">Tap any profile to delete it</p>
                )}
              </div>
            ) : (
              <div className="no-profiles">
                <div className="no-profiles-icon">👋</div>
                <p>No profiles yet! Create your first profile to get started!</p>
              </div>
            )}
            
            <button
              onClick={handleStartNewProfile}
              className="new-profile-button"
            >
              <span className="new-profile-icon">➕</span>
              Create New Profile
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
                    onChange={(e) => handlePrimaryLanguageChange(e.target.value)}
                  />
                  <span className="language-text">English</span>
                </label>
                <label className="language-option">
                  <input
                    type="radio"
                    name="primaryLanguage"
                    value="Hindi"
                    checked={primaryLanguage === 'Hindi'}
                    onChange={(e) => handlePrimaryLanguageChange(e.target.value)}
                  />
                  <span className="language-text">Hindi</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Language</label>
              <div className="language-options">
                <label className={`language-option ${secondaryLanguage === primaryLanguage ? 'disabled' : ''}`}>
                  <input
                    type="radio"
                    name="secondaryLanguage"
                    value="English"
                    checked={secondaryLanguage === 'English'}
                    onChange={(e) => handleSecondaryLanguageChange(e.target.value)}
                    disabled={primaryLanguage === 'English'}
                  />
                  <span className="language-text">English</span>
                </label>
                <label className={`language-option ${secondaryLanguage === primaryLanguage ? 'disabled' : ''}`}>
                  <input
                    type="radio"
                    name="secondaryLanguage"
                    value="Hindi"
                    checked={secondaryLanguage === 'Hindi'}
                    onChange={(e) => handleSecondaryLanguageChange(e.target.value)}
                    disabled={primaryLanguage === 'Hindi'}
                  />
                  <span className="language-text">Hindi</span>
                </label>
              </div>
              {primaryLanguage === secondaryLanguage && (
                <p className="error-message">Secondary language must be different from primary language.</p>
              )}
            </div>

            <div className="form-actions">
              <button
                onClick={handleCreateNewProfile}
                className="start-button"
                disabled={!isFormValid()}
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