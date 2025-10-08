import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgression } from '../contexts/ProgressionContext';

// Utility function moved outside component to avoid dependency issues
const getRandomEmoji = (id, kidEmojis) => {
  // Use the profile ID to consistently get the same emoji for each profile
  const index = parseInt(id) % kidEmojis.length;
  return kidEmojis[index];
};

const ProfileSelector = () => {
  const { triggerProfileChange } = useProgression();
  const [profiles, setProfiles] = useState([]);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [kidName, setKidName] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');
  const [secondaryLanguage, setSecondaryLanguage] = useState('Hindi');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const navigate = useNavigate();

  // Kid-friendly emojis for profile icons
  const kidEmojis = useMemo(() => ['🐶', '🐱', '🐰', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🦄', '🦋', '🐢', '🐬', '🦕', '🦖', '🐳', '🦒', '🦘'], []);

  // Load existing profiles on component mount
  useEffect(() => {
    const loadProfiles = () => {
      const savedProfiles = localStorage.getItem('profiles');
      if (savedProfiles) {
        try {
          const parsedProfiles = JSON.parse(savedProfiles);
          // Ensure each profile has an emoji
          const profilesWithEmojis = parsedProfiles.map(profile => ({
            ...profile,
            emoji: profile.emoji || getRandomEmoji(profile.id, kidEmojis)
          }));
          setProfiles(profilesWithEmojis);
        } catch (error) {
          console.error('Error loading profiles:', error);
          setProfiles([]);
        }
      }
    };
    
    loadProfiles();
  }, [kidEmojis]);



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
      emoji: selectedEmoji || getRandomEmoji(Date.now().toString(), kidEmojis)
    };

    const updatedProfiles = [...profiles, newProfile];
    saveProfiles(updatedProfiles);

    // Set as current profile and navigate
    localStorage.setItem('currentProfile', JSON.stringify(newProfile));
    triggerProfileChange(); // Trigger progression system to load new profile data
    navigate('/map');
  };

  const handleSelectProfile = (profile) => {
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    triggerProfileChange(); // Trigger progression system to load profile data
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
    setSelectedEmoji('');
  };

  const handleCancelNewProfile = () => {
    setShowNewProfileForm(false);
    setKidName('');
    setSelectedEmoji('');
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

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };


  const isFormValid = () => {
    return kidName.trim() && primaryLanguage !== secondaryLanguage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 via-teal-400 to-emerald-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-5xl font-['Quicksand'] font-bold text-white mb-6 drop-shadow-lg leading-tight">
            🐾 My Talking Animals 🐾
          </h1>
          <p className="text-xl text-white font-nunito">
            Choose your profile or create a new one!
          </p>
        </div>
        
        {!showNewProfileForm ? (
          // Profile Selection View
          <div className="space-y-8">
            {profiles.length > 0 ? (
              <div className="bg-white rounded-3xl shadow-large p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-nunito font-bold text-text-primary">Your Profiles</h2>
                  <motion.button
                    onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showDeleteMenu ? (
                      <span className="text-xl text-red-500">✕</span>
                    ) : (
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        className="text-gray-600"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    )}
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((profile) => (
                    <motion.div 
                      key={profile.id} 
                      className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                        showDeleteMenu ? 'border-2 border-red-300 hover:border-red-400' : 'hover:shadow-medium hover:scale-105'
                      }`}
                      onClick={() => showDeleteMenu ? handleDeleteProfile(profile.id) : handleSelectProfile(profile)}
                      whileHover={{ scale: showDeleteMenu ? 1 : 1.03 }}
                      whileTap={{ scale: showDeleteMenu ? 0.95 : 0.98 }}
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4">{profile.emoji}</div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">{profile.kidName}</h3>
                        <p className="text-sm text-text-secondary">
                          {profile.primaryLanguage} • {profile.secondaryLanguage}
                        </p>
                      </div>
                      {showDeleteMenu && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-red-500 bg-opacity-90 flex flex-col items-center justify-center rounded-2xl text-white font-bold"
                        >
                          <span className="text-4xl mb-2">🗑️</span>
                          <span>Delete</span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {showDeleteMenu && (
                  <p className="text-center text-red-600 text-sm mt-4">Tap any profile to delete it</p>
                )}
              </div>
            ) : (
              <div className="text-center p-10 bg-white rounded-3xl shadow-soft">
                <div className="text-6xl mb-4">👋</div>
                <p className="text-lg text-text-secondary">No profiles yet! Create your first profile to get started!</p>
              </div>
            )}
            
            <div className="text-center">
              <motion.button
                onClick={handleStartNewProfile}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-large hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">➕</span>
                Create New Profile
              </motion.button>
            </div>
          </div>
        ) : (
          // New Profile Form
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-large p-8 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-nunito font-bold text-text-primary text-center mb-8">Create New Profile</h2>
            
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="kidName" className="block text-lg font-semibold text-text-primary mb-2">
                  What's your child's name?
                </label>
                <input
                  type="text"
                  id="kidName"
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  placeholder="Enter your child's name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-200 text-lg"
                  maxLength={50}
                />
              </div>

              {/* Animal Selection */}
              <div>
                <label className="block text-lg font-semibold text-text-primary mb-2">
                  Choose an animal friend (optional)
                </label>
                <p className="text-sm text-text-muted mb-4">Pick your favorite animal or we'll choose one for you!</p>
                
                {/* Horizontal Scrollable Emoji List */}
                <div className="relative">
                  <div className="flex overflow-x-auto scrollbar-hide gap-3 py-2 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {kidEmojis.map((emoji, index) => (
                      <motion.button
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 transition-all duration-200 ${
                          selectedEmoji === emoji 
                            ? 'border-primary-500 bg-primary-100 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleEmojiSelect(emoji)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Custom scrollbar styling */}
                  <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                </div>
                
                {selectedEmoji && (
                  <p className="text-sm text-text-secondary mt-3">
                    Selected: <span className="text-primary-600 font-semibold">{selectedEmoji}</span>
                  </p>
                )}
              </div>

              {/* Language Selection with Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Language */}
                <div>
                  <label htmlFor="primaryLanguage" className="block text-lg font-semibold text-text-primary mb-2">
                    Primary Language
                  </label>
                  <select
                    id="primaryLanguage"
                    value={primaryLanguage}
                    onChange={(e) => handlePrimaryLanguageChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-200 text-lg bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                {/* Secondary Language */}
                <div>
                  <label htmlFor="secondaryLanguage" className="block text-lg font-semibold text-text-primary mb-2">
                    Secondary Language
                  </label>
                  <select
                    id="secondaryLanguage"
                    value={secondaryLanguage}
                    onChange={(e) => handleSecondaryLanguageChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-200 text-lg ${
                      primaryLanguage === secondaryLanguage 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 focus:border-primary-500 bg-white'
                    }`}
                  >
                    <option value="English" disabled={primaryLanguage === 'English'}>English</option>
                    <option value="Hindi" disabled={primaryLanguage === 'Hindi'}>Hindi</option>
                  </select>
                  {primaryLanguage === secondaryLanguage && (
                    <p className="text-red-500 text-sm mt-1">Secondary language must be different from primary language</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  onClick={handleCancelNewProfile}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleCreateNewProfile}
                  disabled={!isFormValid()}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isFormValid()
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={isFormValid() ? { scale: 1.02 } : {}}
                  whileTap={isFormValid() ? { scale: 0.98 } : {}}
                >
                  Create Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector; 