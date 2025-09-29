# Sticker Rewards System

This directory contains sticker images that are awarded to users when they complete levels.

## Directory Structure

```
stickers/
├── level1/          # Stickers for level 1 completion
├── level2/          # Stickers for level 2 completion  
├── level3/          # Stickers for level 3 completion
├── level4/          # Stickers for level 4 completion
├── level5/          # Stickers for level 5 completion
└── achievements/    # Special achievement stickers
```

## Naming Convention

### Level Stickers
- **Format**: `level{number}_sticker.png`
- **Examples**:
  - `level1_sticker.png` - Awarded when completing level 1
  - `level2_sticker.png` - Awarded when completing level 2
  - `level3_sticker.png` - Awarded when completing level 3
  - `level4_sticker.png` - Awarded when completing level 4
  - `level5_sticker.png` - Awarded when completing level 5

### Achievement Stickers
- **Format**: `{achievement_name}_sticker.png`
- **Examples**:
  - `first_week_sticker.png`
  - `perfect_score_sticker.png`
  - `all_animals_sticker.png`

## Image Specifications

- **Format**: PNG with transparent background
- **Size**: 200x200px (will be scaled to 64x64px on the board)
- **Quality**: High resolution for crisp display
- **Style**: Bright, colorful, kid-friendly designs

## How It Works

1. When a user completes any level, the system automatically triggers a sticker reward
2. The sticker path is generated based on the current level (1 sticker per level)
3. The sticker appears with a big animation in the center of the screen
4. After 1.5 seconds, it shrinks and moves to the sticker board on the farm
5. Stickers are positioned randomly in the top 20% of the farm image
6. Each sticker has a slight random rotation for a scrapbook effect

## Adding New Stickers

1. Create your sticker image (200x200px PNG with transparency)
2. Name it according to the convention: `level{number}_sticker.png`
3. Place it in the appropriate level folder
4. The system will automatically use it when that level is completed
