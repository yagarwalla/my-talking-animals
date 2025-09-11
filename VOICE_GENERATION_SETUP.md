# Voice Generation Setup Guide

This guide explains how to set up and run the standalone MP3 generation script for all animal voices using Azure Speech Services.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Azure Speech Services** account
3. **npm** package manager

## Setup Instructions

### 1. Install Dependencies

The script requires the `microsoft-cognitiveservices-speech-sdk` and `dotenv` packages. Install them:

```bash
npm install microsoft-cognitiveservices-speech-sdk dotenv
```

### 2. Create Environment File

Create a `.env` file in the project root with your Azure Speech Services credentials:

```bash
# Azure Speech Services Configuration
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=your_azure_region_here
AZURE_SPEECH_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/
```

### 3. Get Azure Speech Services Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Speech Services resource
3. Go to "Keys and Endpoint" section
4. Copy your API key, region, and endpoint URL
5. Update the `.env` file with your actual credentials

### 4. Run the Script

```bash
node generateAnimalVoicesAzureSpeech.js
```

## What the Script Does

The script will generate MP3 files for all animals with the following structure:

```
public/animals/
├── cow/
│   ├── cow_level1_en_hi.mp3
│   ├── cow_level1_hi_en.mp3
│   ├── cow_level2_en_hi.mp3
│   ├── cow_level2_hi_en.mp3
│   ├── ... (all 5 levels)
├── goat/
│   ├── goat_level1_en_hi.mp3
│   ├── goat_level1_hi_en.mp3
│   └── ... (all 5 levels)
└── ... (all 6 animals)
```

## Features

- **60 Total Files**: 6 animals × 5 levels × 2 languages = 60 MP3 files
- **Smart Replacement**: Replaces existing files with new content
- **Progress Tracking**: Shows detailed progress and statistics
- **Error Handling**: Comprehensive error reporting
- **Rate Limiting**: Built-in delays to avoid API limits
- **SSML Support**: Uses Speech Synthesis Markup Language for better clarity
- **Unique Voices**: Each animal has distinct English and Hindi voices with custom pitch
- **Toddler-Optimized**: Slow speech rate for better comprehension

## Animal Voice Personalities

Each animal has unique English and Hindi voices with custom pitch settings:

- **🐄 Cow**: 
  - English: `en-IN-NeerjaNeural` (Neutral, warm)
  - Hindi: `hi-IN-SwaraNeural` (Friendly, clear)
  - Pitch: `+3%` (Slightly higher, gentle)

- **🐐 Goat**: 
  - English: `en-IN-PrabhatNeural` (Energetic, lively)
  - Hindi: `hi-IN-MadhurNeural` (Sweet, melodic)
  - Pitch: `+6%` (Higher, playful)

- **🐑 Sheep**: 
  - English: `en-IN-NeerjaNeural` (Soft, gentle)
  - Hindi: `hi-IN-SwaraNeural` (Calm, soothing)
  - Pitch: `+2%` (Slightly higher, gentle)

- **🐖 Pig**: 
  - English: `en-IN-PrabhatNeural` (Playful, bouncy)
  - Hindi: `hi-IN-MadhurNeural` (Fun, energetic)
  - Pitch: `-3%` (Lower, deeper)

- **🐓 Hen**: 
  - English: `en-IN-NeerjaNeural` (Chirpy, energetic)
  - Hindi: `hi-IN-SwaraNeural` (Quick, lively)
  - Pitch: `+5%` (Higher, chirpy)

- **🐎 Horse**: 
  - English: `en-IN-PrabhatNeural` (Strong, majestic)
  - Hindi: `hi-IN-MadhurNeural` (Powerful, friendly)
  - Pitch: `-4%` (Lower, majestic)

## SSML Features

The script uses Speech Synthesis Markup Language (SSML) for enhanced audio quality with proper mixed-language pronunciation:

### SSML Structure
```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="hi-IN">
  <voice name="hi-IN-SwaraNeural">
    <mstts:express-as style="friendly">
      <prosody rate="slow" pitch="+3%">
        Hi, I am a cow. I am called <emphasis level="strong">गाय</emphasis> in Hindi. Can you say <emphasis level="strong">गाय</emphasis>?
      </prosody>
    </mstts:express-as>
  </voice>
</speak>
```

### Key Features
- **Slow Rate**: `rate="slow"` for toddler-friendly speech clarity
- **Custom Pitch**: Each animal has unique pitch adjustments (+/- percentages)
- **Hindi Voices for Mixed Content**: Uses Hindi voices for both en-hi and hi-en content for better pronunciation
- **Emphasis on Foreign Words**: Hindi words in en-hi files and English words in hi-en files are emphasized
- **Friendly Speaking Style**: Uses `mstts:express-as style="friendly"` for engaging delivery

### Voice Selection Logic
- **All files**: Use Hindi voices (`voice_hi`) with `xml:lang="hi-IN"` for better mixed-language pronunciation
- **en-hi files**: Hindi words are emphasized with `<emphasis level="strong">`
- **hi-en files**: English words in quotes are emphasized with `<emphasis level="strong">`

### Why Hindi Voices for Mixed Content?
Hindi neural voices are better at pronouncing both English and Hindi words in mixed-language sentences, ensuring that:
- Hindi words like "गाय" are properly pronounced in English sentences
- English words like "cow" are clearly spoken in Hindi sentences
- The overall pronunciation is more natural and understandable for children

## Troubleshooting

### Common Issues

1. **"Missing Azure Speech Services credentials"**
   - Make sure your `.env` file exists and has the correct variables
   - Check that your API key, region, and endpoint are valid

2. **"Request failed" errors**
   - Verify your Azure Speech Services endpoint URL is correct
   - Ensure your Speech Services resource is active
   - Check your API quota and billing

3. **"File already exists" messages**
   - This is normal - the script replaces existing files
   - Files are automatically replaced with new content

4. **Hindi pronunciation issues**
   - The script uses Hindi voices for mixed-language content for better pronunciation
   - Hindi words in en-hi files are emphasized for clarity
   - English words in hi-en files are emphasized for clarity

### Getting Help

- Check the console output for detailed error messages
- Verify your Azure Speech Services resource is active and properly configured
- Ensure you have sufficient API quota for speech synthesis requests

## File Naming Convention

Files follow this pattern: `{animal}_{level}_{language_direction}.mp3`

- **Animal**: cow, goat, sheep, pig, hen, horse
- **Level**: level1, level2, level3, level4, level5
- **Language Direction**: en_hi (English introducing Hindi), hi_en (Hindi introducing English)

Example: `cow_level3_hi_en.mp3` = Cow's level 3 phrase in Hindi introducing English words.

**Note**: The script automatically converts hyphens to underscores in filenames to match the farm.json configuration format.
