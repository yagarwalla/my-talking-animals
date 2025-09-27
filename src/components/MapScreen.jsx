import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion for animations

const MapScreen = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapConfig, setMapConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function to calculate positions based on map dimensions
  const getPosition = (xPercent, yPercent) => ({
    left: `${xPercent}%`,
    top: `${yPercent}%`
  });

  // Load map configuration from JSON file
  useEffect(() => {
    const loadMapConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/config/map.json');
        if (!response.ok) {
          throw new Error('Failed to load map configuration');
        }
        const config = await response.json();
        setMapConfig(config);
      } catch (err) {
        console.error('Error loading map config:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMapConfig();
  }, []);

  // Map areas with flexible positioning (using percentages)
  // 
  // POSITIONING GUIDE:
  // - left: 0% = left edge, 50% = center, 100% = right edge
  // - top: 0% = top edge, 50% = center, 100% = bottom edge
  // - Current positions are estimates - adjust these values to match your map!
  //
  // To adjust positions:
  // 1. Change the percentage values in getPosition(x%, y%)
  // 2. Refresh the page to see changes
  // 3. Fine-tune until overlays align with your map features
  //
  const mapAreas = useMemo(() => {
    if (!mapConfig) return [];
    
    return mapConfig.areas.map(area => ({
      ...area,
      ...getPosition(parseFloat(area.position.x), parseFloat(area.position.y))
    }));
  }, [mapConfig]);

  // Debug: Log map areas data
  console.log('🗺️ Map areas data:', mapAreas);
  console.log('📍 Farm overlay path:', mapAreas.find(a => a.id === 'farm')?.pngSrc);

  // Debug: Test if PNG files can be fetched
  useEffect(() => {
    mapAreas.forEach(area => {
      fetch(area.pngSrc)
        .then(response => {
          if (response.ok) {
            console.log(`✅ ${area.name} PNG file accessible:`, area.pngSrc);
          } else {
            console.error(`❌ ${area.name} PNG file not accessible:`, area.pngSrc, 'Status:', response.status);
          }
        })
        .catch(error => {
          console.error(`❌ ${area.name} PNG file fetch error:`, area.pngSrc, error);
        });
    });
  }, [mapAreas]);

  // Debug: Log layout dimensions and spacing
  useEffect(() => {
    const logLayoutInfo = () => {
      const mapScreen = document.querySelector('.map-screen');
      const mapHeader = document.querySelector('.map-header');
      const mapScene = document.querySelector('.map-scene');
      const mapBackgroundContainer = document.querySelector('.map-background-container');
      const mapBackgroundImage = document.querySelector('.map-background-image');
      
      if (mapScreen) {
        const screenRect = mapScreen.getBoundingClientRect();
        const screenStyles = window.getComputedStyle(mapScreen);
        console.log('📐 Map Screen Debug:', {
          element: 'map-screen',
          rect: screenRect,
          padding: screenStyles.padding,
          margin: screenStyles.margin,
          width: screenStyles.width,
          height: screenStyles.height,
          maxWidth: screenStyles.maxWidth
        });
      }
      
      if (mapHeader) {
        const headerRect = mapHeader.getBoundingClientRect();
        const headerStyles = window.getComputedStyle(mapHeader);
        console.log('📐 Map Header Debug:', {
          element: 'map-header',
          rect: headerRect,
          padding: headerStyles.padding,
          margin: headerStyles.margin,
          marginBottom: headerStyles.marginBottom
        });
      }
      
      if (mapScene) {
        const sceneRect = mapScene.getBoundingClientRect();
        const sceneStyles = window.getComputedStyle(mapScene);
        console.log('📐 Map Scene Debug:', {
          element: 'map-scene',
          rect: sceneRect,
          padding: sceneStyles.padding,
          margin: sceneStyles.margin,
          width: sceneStyles.width,
          height: sceneStyles.height,
          maxWidth: sceneStyles.maxWidth
        });
      }
      
      if (mapBackgroundContainer) {
        const containerRect = mapBackgroundContainer.getBoundingClientRect();
        const containerStyles = window.getComputedStyle(mapBackgroundContainer);
        console.log('📐 Map Background Container Debug:', {
          element: 'map-background-container',
          rect: containerRect,
          padding: containerStyles.padding,
          margin: containerStyles.margin,
          width: containerStyles.width,
          height: containerStyles.height
        });
      }
      
      if (mapBackgroundImage) {
        const imageRect = mapBackgroundImage.getBoundingClientRect();
        const imageStyles = window.getComputedStyle(mapBackgroundImage);
        console.log('📐 Map Background Image Debug:', {
          element: 'map-background-image',
          rect: imageRect,
          padding: imageStyles.padding,
          margin: imageStyles.margin,
          width: imageStyles.width,
          height: imageStyles.height,
          objectFit: imageStyles.objectFit
        });
      }
      
      // Calculate spacing between elements
      if (mapHeader && mapScene) {
        const headerRect = mapHeader.getBoundingClientRect();
        const sceneRect = mapScene.getBoundingClientRect();
        const spacing = sceneRect.top - headerRect.bottom;
        
        // Check for any elements between header and scene
        const allElements = document.querySelectorAll('*');
        const elementsBetween = [];
        
        allElements.forEach(el => {
          const elRect = el.getBoundingClientRect();
          if (elRect.top > headerRect.bottom && elRect.bottom < sceneRect.top) {
            const styles = window.getComputedStyle(el);
            if (styles.height !== '0px' && styles.height !== 'auto' && 
                (parseFloat(styles.height) > 0 || elRect.height > 0)) {
              elementsBetween.push({
                element: el.tagName,
                className: el.className,
                height: elRect.height,
                marginTop: styles.marginTop,
                marginBottom: styles.marginBottom,
                paddingTop: styles.paddingTop,
                paddingBottom: styles.paddingBottom
              });
            }
          }
        });
        
        console.log('📏 Spacing Analysis:', {
          headerBottom: headerRect.bottom,
          sceneTop: sceneRect.top,
          spacingBetween: spacing,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          elementsBetween: elementsBetween
        });
        
        // Check if there's a gap that's not from elements
        if (elementsBetween.length === 0 && spacing > 0) {
          console.log('🔍 No elements found between header and scene - gap is from CSS layout');
          
          // Check parent containers
          let current = mapScene.parentElement;
          while (current && current !== mapHeader) {
            const currentRect = current.getBoundingClientRect();
            const currentStyles = window.getComputedStyle(current);
            console.log('🔍 Parent element:', {
              tagName: current.tagName,
              className: current.className,
              top: currentRect.top,
              height: currentRect.height,
              marginTop: currentStyles.marginTop,
              marginBottom: currentStyles.marginBottom,
              paddingTop: currentStyles.paddingTop,
              paddingBottom: currentStyles.paddingBottom,
              display: currentStyles.display,
              flexDirection: currentStyles.flexDirection,
              justifyContent: currentStyles.justifyContent,
              alignItems: currentStyles.alignItems,
              gap: currentStyles.gap,
              rowGap: currentStyles.rowGap,
              columnGap: currentStyles.columnGap
            });
            current = current.parentElement;
          }
          
          // Specifically check map-screen container
          if (mapScreen) {
            const screenRect = mapScreen.getBoundingClientRect();
            const screenStyles = window.getComputedStyle(mapScreen);
            console.log('🔍 Map Screen Container Analysis:', {
              height: screenRect.height,
              display: screenStyles.display,
              flexDirection: screenStyles.flexDirection,
              justifyContent: screenStyles.justifyContent,
              alignItems: screenStyles.alignItems,
              gap: screenStyles.gap,
              rowGap: screenStyles.rowGap,
              columnGap: screenStyles.columnGap,
              paddingTop: screenStyles.paddingTop,
              paddingBottom: screenStyles.paddingBottom,
              marginTop: screenStyles.marginTop,
              marginBottom: screenStyles.marginBottom
            });
          }
        }
      }
    };
    
    // Only log if not loading and no error
    if (!loading && !error) {
      // Log immediately and on resize
      logLayoutInfo();
      window.addEventListener('resize', logLayoutInfo);
      
      return () => window.removeEventListener('resize', logLayoutInfo);
    }
  }, [mapConfig, loading, error]);

  const handleAreaClick = (area) => {
    setSelectedArea(area);

    // Animate and navigate after a short delay
    setTimeout(() => {
      navigate(`/area/${area.id}`);
    }, 300);
  };

  if (loading) {
    return (
      <div className="map-screen">
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-screen">
        <div className="error-container">
          <h2>Error Loading Map</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }


  return (
    <div className="map-screen">
      <div className="map-header">
        <h1 className="map-title">My Talking Animals World</h1>
        <p className="map-subtitle">Click on an area to explore!</p>
      </div>

      <div className="map-scene">
        <div className="map-background-container">
          {/* Background landscape image */}
          <img
            src={mapConfig?.background || "/maps/landscape-map.jpg"}
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
            className="map-svg-fallback"
            style={{ display: 'none' }}
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
          >
            <rect width="100%" height="100%" fill="#87CEEB" />
            <text x="50%" y="50%" textAnchor="middle" fill="white" fontSize="24">
              Map Loading...
            </text>
          </svg>

          {/* Map area overlays */}
          {mapAreas.map((area) => {
            // Debug: Log each overlay being rendered
            console.log(`🎯 Rendering overlay: ${area.name} at position:`, area.left, area.top);
            
            return (
              <motion.div
                key={area.id}
                className="map-area-overlay"
                style={{
                  position: 'absolute',
                  left: area.left,
                  top: area.top,
                  width: '336px',
                  height: '252px',
                  zIndex: 10,
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAreaClick(area)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleAreaClick(area);
                  }
                }}
              >
                {/* Debug: Log before rendering image */}
                {console.log(`🖼️ About to render image for ${area.name}:`, area.pngSrc)}
                
                <motion.img
                  src={area.pngSrc}
                  alt={`${area.name} Overlay`}
                  className="area-png-overlay"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  animate={{ 
                    scale: selectedArea?.id === area.id ? 1.2 : 1 
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300,
                    damping: 20,
                    duration: 0.2
                  }}
                  onLoad={(e) => {
                    console.log(`✅ ${area.name} overlay loaded successfully:`, area.pngSrc);
                    console.log('Image dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                    console.log('Image element:', e.target);
                    console.log('Image computed styles:', window.getComputedStyle(e.target));
                    // Debug: Log the actual image dimensions
                    console.log(`${area.name} image natural size:`, e.target.naturalWidth, 'x', e.target.naturalHeight);
                    console.log(`${area.name} image display size:`, e.target.offsetWidth, 'x', e.target.offsetHeight);
                    
                    // Special debugging for farm overlay
                    if (area.id === 'farm') {
                      console.log('🔍 Farm overlay special debug:');
                      console.log('Farm image element:', e.target);
                      console.log('Farm image parent:', e.target.parentElement);
                      console.log('Farm image parent styles:', window.getComputedStyle(e.target.parentElement));
                      console.log('Farm image position:', e.target.getBoundingClientRect());
                    }
                  }}
                  onError={(e) => {
                    console.error(`❌ ${area.name} overlay failed to load:`, area.pngSrc);
                    // Fallback to colored rectangle if PNG fails to load
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                {/* Fallback colored rectangle if PNG fails to load */}
                <div
                  className="area-fallback"
                  style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    backgroundColor: area.color,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px'
                }}
                >
                  {area.name}
                </div>
              </motion.div>
            );
          })}
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