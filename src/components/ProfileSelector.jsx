import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSelector = () => {
  const [kidName, setKidName] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');
  const [secondaryLanguage, setSecondaryLanguage] = useState('Hindi');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!kidName.trim()) {
      alert('Please enter your child\'s name');
      return;
    }

    const profile = {
      kidName: kidName.trim(),
      primaryLanguage,
      secondaryLanguage,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('profile', JSON.stringify(profile));
    navigate('/map');
  };

  return (
    <div className="profile-selector">
      <div className="profile-container">
        <h1 className="profile-title">Welcome to My Talking Animals!</h1>
        <p className="profile-subtitle">Let's set up your child's profile</p>
        
        <div className="profile-form">
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

          <button
            onClick={handleStart}
            className="start-button"
            disabled={!kidName.trim()}
          >
            Start Adventure!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelector; 