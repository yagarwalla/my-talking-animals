# 🚜 Farm System Setup Guide

## 🎯 **New Features Implemented**

### **1. JSON-Based Configuration**
- **File**: `public/config/farm.json`
- **Dynamic Loading**: Farm configuration loads at runtime
- **Easy Updates**: Modify animal positions, sounds, and sprites without code changes

### **2. Advanced Animal Components**
- **Dual Sprites**: Idle and talking states for each animal
- **Audio Integration**: Howler.js for voice lines and animal sounds
- **Interactive Animations**: Bounce, blink, and sparkle effects
- **Multi-language Support**: English and Hindi names

### **3. Professional Audio System**
- **Voice Lines**: Educational content in multiple languages
- **Animal Sounds**: Authentic animal noises
- **Layered Playback**: Voice first, then animal sound
- **Volume Control**: Optimized audio levels

## 📁 **Required File Structure**

```
public/
├── config/
│   └── farm.json                    # Farm configuration
├── maps/
│   └── farm-background.jpg         # Farm background scene
└── animals/
    ├── cow/
    │   ├── cow_idle.png            # Cow idle sprite
    │   ├── cow_openmouth.png       # Cow talking sprite
    │   ├── moo.mp3                 # Cow sound effect
    │   └── lines/
    │       └── cow_hi_generic_en_hi.mp3  # Voice line
    ├── pig/
    │   ├── pig_idle.png            # Pig idle sprite
    │   ├── pig_openmouth.png       # Pig talking sprite
    │   ├── oink.mp3                # Pig sound effect
    │   └── lines/
    │       └── pig_hi_generic_en_hi.mp3  # Voice line
    ├── goat/
    │   ├── goat_idle.png           # Goat idle sprite
    │   ├── goat_openmouth.png      # Goat talking sprite
    │   ├── baa.mp3                 # Goat sound effect
    │   └── lines/
    │       └── goat_hi_generic_en_hi.mp3 # Voice line
    ├── sheep/
    │   ├── sheep_idle.png          # Sheep idle sprite
    │   ├── sheep_openmouth.png     # Sheep talking sprite
    │   ├── baa.mp3                 # Sheep sound effect
    │   └── lines/
    │       └── sheep_hi_generic_en_hi.mp3 # Voice line
    ├── hen/
    │   ├── hen_idle.png            # Hen idle sprite
    │   ├── hen_openmouth.png       # Hen talking sprite
    │   ├── cluck.mp3               # Hen sound effect
    │   └── lines/
    │       └── hen_hi_generic_en_hi.mp3  # Voice line
    └── horse/
        ├── horse_idle.png          # Horse idle sprite
        ├── horse_openmouth.png     # Horse talking sprite
        ├── neigh.mp3               # Horse sound effect
        └── lines/
            └── horse_hi_generic_en_hi.mp3 # Voice line
```

**Note**: Files in the `public/` directory are served at the root URL. For example:
- `public/config/farm.json` → `/config/farm.json`
- `public/maps/farm-background.jpg` → `/maps/farm-background.jpg`
- `public/animals/cow/cow_idle.png` → `/animals/cow/cow_idle.png`

## 🎨 **Image Requirements**

### **Background Image:**
- **File**: `farm-background.jpg`
- **Size**: 900x600px (or larger)
- **Format**: PNG with full color
- **Content**: Complete farm scene with sky, hills, barn, fence, trees, grass

### **Animal Sprites:**
- **Idle Sprites**: Animals in resting/neutral pose
- **Talking Sprites**: Animals with open mouth or animated expression
- **Size**: 300x225px (will scale automatically)
- **Format**: PNG with transparent background
- **Style**: Consistent cartoon aesthetic matching background

## 🔊 **Audio Requirements**

### **Animal Sounds:**
- **Format**: MP3 (recommended) or WAV
- **Duration**: 1-3 seconds
- **Quality**: 44.1kHz, 128kbps minimum
- **Volume**: Normalized to -12dB to -6dB

### **Voice Lines:**
- **Format**: MP3 (recommended) or WAV
- **Duration**: 3-8 seconds
- **Quality**: 44.1kHz, 128kbps minimum
- **Content**: Educational phrases in English and Hindi
- **Example**: "Hello! I'm a cow. I give milk and say moo!"

## ⚙️ **Configuration Options**

### **Animal Positioning:**
```json
"position": { "x": 120, "y": 300 }
```
- **x**: Distance from left edge in pixels
- **y**: Distance from top edge in pixels
- **Coordinate System**: Top-left origin (0,0)

### **Multi-language Names:**
```json
"name": { "en": "Cow", "hi": "गाय" }
```
- **en**: English name
- **hi**: Hindi name (Unicode supported)
- **Fallback**: English used if language not found

### **Audio Paths:**
```json
"sound": "animals/cow/moo.mp3",
"voice": "animals/cow/lines/cow_hi_generic_en_hi.mp3"
```
- **Relative Paths**: From `public/` directory
- **File Organization**: Logical grouping by animal type

## 🎭 **Animation Features**

### **On Click:**
1. **Sparkle Effect**: 6 golden sparkles radiate outward
2. **Talking Animation**: Sprite switches to open-mouth version
3. **Bounce Effect**: Animal moves up and down slightly
4. **Rotation**: Gentle side-to-side movement
5. **Audio Playback**: Voice line followed by animal sound

### **On Hover:**
- **Scale Effect**: Animal grows to 110% size
- **Smooth Transition**: 0.3s ease animation

### **On Tap:**
- **Scale Down**: Animal shrinks to 95% for tactile feedback

## 🌐 **Language Support**

### **Current Languages:**
- **English (en)**: Primary language
- **Hindi (hi)**: Secondary language with Unicode support

### **Language Toggle:**
- **UI Buttons**: English/हिंदी toggle in header
- **Profile Integration**: Automatically uses profile language preference
- **Dynamic Content**: All text updates based on selected language

## 🚀 **Testing Checklist**

### **Image Loading:**
- [ ] Background image displays correctly
- [ ] All animal sprites load (idle and talking)
- [ ] Fallback handling for missing images
- [ ] Proper sizing and positioning

### **Audio Functionality:**
- [ ] Animal sounds play on click
- [ ] Voice lines play before animal sounds
- [ ] Audio levels are appropriate
- [ ] No console errors for missing audio

### **Animations:**
- [ ] Sparkle effects appear on click
- [ ] Talking animations work smoothly
- [ ] Hover effects respond correctly
- [ ] No animation conflicts or glitches

### **Language Support:**
- [ ] Language toggle works
- [ ] Names display in correct language
- [ ] UI text updates appropriately
- [ ] Hindi text renders correctly

## 🔧 **Troubleshooting**

### **Common Issues:**
1. **Images Not Loading**: Check file paths and ensure files exist
2. **Audio Not Playing**: Verify audio file formats and browser compatibility
3. **Positioning Problems**: Adjust x,y coordinates in JSON
4. **Language Issues**: Check Unicode encoding for Hindi text

### **Performance Tips:**
- **Image Optimization**: Compress PNG files without quality loss
- **Audio Compression**: Use MP3 format for smaller file sizes
- **Preloading**: Audio files preload for instant playback
- **Error Handling**: Graceful fallbacks for missing resources

## 🔮 **Future Enhancements**

- **More Languages**: Add Spanish, French, etc.
- **Advanced Animations**: Walking, eating, sleeping states
- **Interactive Elements**: Feeding, petting, grooming
- **Educational Content**: Animal facts, habitat information
- **Sound Variations**: Multiple voice lines per animal
- **Seasonal Themes**: Different backgrounds and behaviors
