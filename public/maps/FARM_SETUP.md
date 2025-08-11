# Farm Area Setup Guide

## 🚜 **Required Image Files**

Place these files in the `public/maps/` directory:

### **Background Image:**
- **`farm-background.png`** - The main farm scene background
  - **Size**: 900x600px (or larger, will scale automatically)
  - **Content**: Farm landscape with sky, hills, barn, fence, trees, and ground
  - **Format**: PNG with full color (no transparency needed)

### **Animal Overlays:**
- **`cow-overlay.png`** - Dairy cow character
  - **Size**: 300x225px (will scale automatically)
  - **Content**: Cow with brown/white patches, friendly expression
  - **Format**: PNG with transparent background
  - **Position**: `left: 15%, top: 45%`

- **`pig-overlay.png`** - Pink pig character
  - **Size**: 300x225px (will scale automatically)
  - **Content**: Cute pink pig with curly tail and friendly smile
  - **Format**: PNG with transparent background
  - **Position**: `left: 25%, top: 60%`

- **`goat-overlay.png`** - Light brown goat character
  - **Size**: 300x225px (will scale automatically)
  - **Content**: Goat with small horns and little beard
  - **Format**: PNG with transparent background
  - **Position**: `left: 45%, top: 55%`

- **`sheep-overlay.png`** - White sheep character
  - **Size**: 300x225px (will scale automatically)
  - **Content**: Fluffy white sheep with soft wool and gentle eyes
  - **Format**: PNG with transparent background
  - **Position**: `left: 60%, top: 50%`

- **`hen-overlay.png`** - Brown hen character
  - **Size**: 300x225px (will scale automatically)
  - **Content**: Friendly brown hen with red comb and bright eyes
  - **Format**: PNG with transparent background
  - **Position**: `left: 75%, top: 65%`

- **`horse-overlay.png`** - Brown horse character
  - **Size**: 300x225px (will scale automatically)
  - **Content**: Beautiful brown horse with flowing mane and tail
  - **Format**: PNG with transparent background
  - **Position**: `left: 35%, top: 35%`

## 🎯 **Current Configuration**

The farm area is set up with:
- **Background**: Full farm scene
- **Animals**: 6 farm animals (cow, pig, goat, sheep, hen, horse)
- **Interactions**: Click to select, hover effects, info panel
- **Animations**: Framer Motion scaling and transitions
- **Sounds**: Each animal has its unique sound (moo, oink, baa, cluck, neigh)

## 🔧 **Animal Positioning Map**

```
Top (0%)
    Horse (35%, 35%)
    |
    |     Cow (15%, 45%)
    |        |
    |        Pig (25%, 60%)
    |           |
    |           Goat (45%, 55%)
    |              |
    |              Sheep (60%, 50%)
    |                 |
    |                 Hen (75%, 65%)
    |
Bottom (100%)
```

## 📍 **Positioning Guide**

- **`left`**: 0% = left edge, 50% = center, 100% = right edge
- **`top`**: 0% = top edge, 50% = center, 100% = bottom edge

## 🎨 **Image Requirements**

### **Background:**
- High quality, colorful farm scene
- Include sky, clouds, hills, barn, fence, trees, grass
- Child-friendly, cartoon style
- No transparency needed

### **Animal Overlays:**
- Individual animals with transparent backgrounds
- Consistent art style with background
- Friendly, approachable expressions
- **Size**: 300x225px (larger, more prominent display)

## 🚀 **Testing**

1. **Upload all images** to `public/maps/` directory
2. **Navigate** to `/area/farm` from the map
3. **Click each animal** to see their info panel and sound
4. **Hover effects** should show scaling for all animals
5. **Check console** for any loading errors

## 🔮 **Future Enhancements**

- Implement actual animal sounds using Howler.js
- Add interactive animations (walking, eating, etc.)
- Include educational content about each animal
- Add feeding and petting interactions
- Create animal families and baby animals
