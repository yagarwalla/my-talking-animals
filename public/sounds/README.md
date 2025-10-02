# Sound Effects

This directory contains sound effects used throughout the My Talking Animals app.

## Files

### applause.mp3
- **Purpose**: Played when a sticker reward is earned
- **Format**: MP3
- **Duration**: 2-3 seconds recommended
- **Volume**: Set to 70% in code
- **Usage**: Automatic playback when sticker animation starts

## Audio Requirements

- **Format**: MP3 (for best browser compatibility)
- **Quality**: 128kbps or higher
- **Duration**: Keep under 5 seconds for sound effects
- **Volume**: Normalized audio (code will handle volume control)

## Adding New Sounds

1. Add your MP3 file to this directory
2. Update the component to reference the new sound file
3. Test in different browsers to ensure compatibility

## Browser Compatibility

- Modern browsers support MP3 format
- Some browsers may require user interaction before playing audio
- Error handling is included in the code for graceful fallbacks