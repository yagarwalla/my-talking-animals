import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MapScreen = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const navigate = useNavigate();

  // Map areas with coordinates based on the image layout
  const mapAreas = [
    {
      id: 'farm',
      name: 'Farm',
      // Left side area where the red barn is located
      path: 'M 50 200 L 200 200 L 200 350 L 50 350 Z',
      color: 'rgba(255, 0, 0, 0.3)',
      description: 'Visit the farm animals!'
    },
    {
      id: 'forest',
      name: 'Forest',
      // Center area where the trees are located
      path: 'M 250 150 L 400 150 L 400 300 L 250 300 Z',
      color: 'rgba(34, 139, 34, 0.3)',
      description: 'Explore the forest!'
    },
    {
      id: 'lake',
      name: 'Lake',
      // Right side area where the blue lake is located
      path: 'M 450 250 L 600 250 L 600 400 L 450 400 Z',
      color: 'rgba(70, 130, 180, 0.3)',
      description: 'Swim with the fish!'
    },
    {
      id: 'mountain',
      name: 'Mountain',
      // Top center area where the mountains are located
      path: 'M 300 50 L 450 50 L 450 150 L 300 150 Z',
      color: 'rgba(105, 105, 105, 0.3)',
      description: 'Climb the mountain!'
    }
  ];

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    
    // Animate and navigate after a short delay
    setTimeout(() => {
      navigate(`/area/${area.id}`);
    }, 300);
  };

  return (
    <div className="map-screen">
      <div className="map-header">
        <h1 className="map-title">My Talking Animals World</h1>
        <p className="map-subtitle">Click on an area to explore!</p>
      </div>
      
      <div className="map-container">
        <div className="map-image-container">
          {/* Background landscape image */}
          <img 
            src="/maps/landscape-map.jpg" 
            alt="Landscape Map" 
            className="map-background-image"
            onError={(e) => {
              // Fallback to SVG if image fails to load
              e.target.style.display = 'none';
              const svgFallback = document.querySelector('.map-svg-fallback');
              if (svgFallback) svgFallback.style.display = 'block';
            }}
          />
          
          {/* SVG Fallback */}
          <svg 
            viewBox="0 0 700 500" 
            className="map-svg-fallback"
            preserveAspectRatio="xMidYMid meet"
            style={{ display: 'none' }}
          >
            {/* Sky */}
            <rect width="700" height="500" fill="#87CEEB" />
            
            {/* Clouds */}
            <circle cx="150" cy="80" r="20" fill="white" opacity="0.8" />
            <circle cx="170" cy="80" r="25" fill="white" opacity="0.8" />
            <circle cx="190" cy="80" r="20" fill="white" opacity="0.8" />
            <circle cx="550" cy="100" r="15" fill="white" opacity="0.8" />
            <circle cx="570" cy="100" r="20" fill="white" opacity="0.8" />
            <circle cx="590" cy="100" r="15" fill="white" opacity="0.8" />
            
            {/* Mountains */}
            <polygon points="300,150 350,80 400,150" fill="#696969" />
            <polygon points="350,150 400,70 450,150" fill="#808080" />
            <polygon points="400,150 450,90 500,150" fill="#A9A9A9" />
            <polygon points="350,80 400,70 400,80" fill="white" />
            <polygon points="400,70 450,90 450,70" fill="white" />
            
            {/* Hills */}
            <ellipse cx="350" cy="400" rx="400" ry="100" fill="#90EE90" />
            <ellipse cx="350" cy="420" rx="350" ry="80" fill="#98FB98" />
            
            {/* Paths */}
            <path d="M 100 350 Q 200 320 300 350 Q 400 380 500 350 Q 600 320 650 350" 
                  stroke="#D2B48C" strokeWidth="8" fill="none" />
            
            {/* Farm (Red Barn) */}
            <rect x="80" y="280" width="60" height="40" fill="#8B0000" />
            <polygon points="80,280 110,260 140,280" fill="#A52A2A" />
            <rect x="95" y="290" width="10" height="10" fill="white" />
            <rect x="105" y="300" width="20" height="20" fill="white" stroke="#8B0000" strokeWidth="2" />
            
            {/* Forest (Trees) */}
            <circle cx="320" cy="320" r="25" fill="#228B22" />
            <circle cx="340" cy="300" r="20" fill="#32CD32" />
            <polygon points="350,320 360,280 370,320" fill="#006400" />
            <rect x="315" y="340" width="10" height="20" fill="#8B4513" />
            <rect x="335" y="315" width="8" height="15" fill="#8B4513" />
            <rect x="355" y="315" width="8" height="15" fill="#8B4513" />
            
            {/* Lake */}
            <ellipse cx="550" cy="350" rx="80" ry="40" fill="#4682B4" />
            <ellipse cx="550" cy="350" rx="70" ry="35" fill="#5F9EA0" />
            
            {/* Bushes */}
            <circle cx="200" cy="380" r="8" fill="#228B22" />
            <circle cx="450" cy="390" r="10" fill="#32CD32" />
            <circle cx="300" cy="400" r="6" fill="#228B22" />
            <circle cx="600" cy="380" r="7" fill="#32CD32" />
          </svg>
          
          {/* Clickable overlay areas */}
          <svg 
            viewBox="0 0 700 500" 
            className="map-overlay"
            preserveAspectRatio="xMidYMid meet"
          >
            {mapAreas.map((area) => (
              <motion.g
                key={area.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAreaClick(area)}
                className="map-area-group"
                style={{ cursor: 'pointer' }}
              >
                <motion.path
                  d={area.path}
                  fill={area.color}
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="map-area"
                />
                <text
                  x={area.path.split(' ')[1]}
                  y={parseInt(area.path.split(' ')[2]) + 30}
                  textAnchor="middle"
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  className="area-label"
                  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}
                >
                  {area.name}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>
      </div>

      {/* Area Info Panel */}
      {selectedArea && (
        <motion.div
          className="area-info-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <h3>{selectedArea.name}</h3>
          <p>{selectedArea.description}</p>
          <div className="loading-indicator">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Loading {selectedArea.name}...</p>
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      <motion.button
        className="back-button"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Profiles
      </motion.button>
    </div>
  );
};

export default MapScreen; 