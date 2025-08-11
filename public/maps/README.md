# Map PNG Overlays Setup

This directory contains the PNG overlay files for the interactive map areas.

## Required Files

Place the following PNG files in this directory:

- `farm-overlay.png` - Farm area overlay (336x252px recommended)
- `forest-overlay.png` - Forest area overlay (336x252px recommended)  
- `lake-overlay.png` - Lake area overlay (336x252px recommended)
- `mountain-overlay.png` - Mountain area overlay (336x252px recommended)

## File Requirements

- **Format**: PNG with transparent background
- **Size**: 336x252 pixels (will scale automatically)
- **Background**: Transparent (PNG alpha channel)
- **Content**: Visual elements representing each area (trees, mountains, etc.)

## Fallback System

If PNG files fail to load, the system will automatically show colored rectangles as fallbacks:
- Farm: Red rectangle
- Forest: Green rectangle  
- Lake: Blue rectangle
- Mountain: Gray rectangle

## Positioning

The overlays are positioned using CSS absolute positioning:
- Farm: `left: 1%, top: 30%`
- Forest: `left: 30%, top: 30%`
- Lake: `left: 40%, top: 45%`
- Mountain: `left: 35%, top: 1%`

## Animation

Each overlay animates using Framer Motion:
- **Hover**: Scale 1.05x with brightness increase
- **Selected**: Scale 1.3x with spring animation
- **Click**: Scale 0.98x for tactile feedback

## Testing

1. Upload your PNG files to this directory
2. Refresh the map screen
3. Hover over areas to see animations
4. Click areas to see selection scaling
5. Check browser console for any loading errors 