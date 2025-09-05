# Animal Template System

This document explains the new template-based animal speech system that replaces the random GPT generation with structured, varied conversations.

## Overview

The template system provides:
- **Structured conversations** using predefined templates
- **Session tracking** to avoid repetition
- **Variety** through template rotation
- **Consistent quality** with controlled GPT prompts

## How It Works

### 1. Templates

Templates define the structure of what animals say. Each template has:
- **ID**: Unique identifier (e.g., 'intro', 'funFact')
- **Structure**: Template string with placeholders
- **Description**: What the template is for
- **Example**: Sample output

Available templates:
- **intro**: Animal introduces itself and teaches its name
- **funFact**: Shares an interesting fact about the animal
- **challenge**: Gives the child a fun task to do
- **praise**: Celebrates the child's success
- **question**: Asks a simple question and teaches vocabulary

### 2. Session State

The system tracks:
- Which animals the child has interacted with
- Which templates have been used for each animal
- Total interactions and session duration
- Timestamps for each interaction

### 3. Template Selection

When generating speech:
1. Get unused templates for the specific animal
2. Pick a random unused template
3. If all templates used, reset and pick random
4. Generate GPT response using the template structure
5. Record the interaction with the used template

## Usage

### Basic Usage

```typescript
import { getAnimalLine } from './utils/generateAnimalSpeech';
import { useAnimalSession } from './contexts/AnimalSessionContext';

const MyComponent = () => {
  const { getUsedTemplatesForAnimal, recordAnimalInteraction } = useAnimalSession();
  
  const handleAnimalClick = async (animal) => {
    const usedTemplates = getUsedTemplatesForAnimal(animal.id);
    
    const result = await getAnimalLine({
      animalId: animal.id,
      animalName: animal.name,
      languageCode: 'hi',
      usedTemplates,
      azureKey: process.env.REACT_APP_AZURE_AI_FOUNDRY_KEY,
      gptEndpoint: process.env.REACT_APP_GPT_ENDPOINT,
      ttsEndpoint: process.env.REACT_APP_TTS_ENDPOINT
    });
    
    // Record the interaction
    recordAnimalInteraction(animal.id, result.templateId);
    
    // Use the generated speech
    console.log(result.text); // The generated text
    console.log(result.audioUrl); // The audio URL
    console.log(result.templateId); // Which template was used
  };
};
```

### Session Management

```typescript
import { useAnimalSession } from './contexts/AnimalSessionContext';

const SessionManager = () => {
  const { sessionState, resetSession, hasInteractedWithAnimal } = useAnimalSession();
  
  // Check if animal has been interacted with
  const hasInteracted = hasInteractedWithAnimal('cow');
  
  // Get session statistics
  const { totalInteractions, animalInteractions } = sessionState;
  
  // Reset session (clears all interactions)
  const handleReset = () => {
    resetSession();
  };
  
  return (
    <div>
      <p>Total interactions: {totalInteractions}</p>
      <p>Animals interacted: {Object.keys(animalInteractions).length}</p>
      <button onClick={handleReset}>Reset Session</button>
    </div>
  );
};
```

## Configuration

### Environment Variables

Required environment variables:
- `REACT_APP_AZURE_AI_FOUNDRY_KEY`: Azure OpenAI API key
- `REACT_APP_GPT_ENDPOINT`: GPT API endpoint
- `REACT_APP_TTS_ENDPOINT`: Text-to-speech endpoint

### Language Support

The system supports multiple languages:
- **Hindi (hi)**: Default secondary language
- **Spanish (es)**: Available for all animals
- **French (fr)**: Available for all animals

Animal words are predefined for each language:
- Cow: Hindi (gaye), Spanish (vaca), French (vache)
- Goat: Hindi (bakri), Spanish (cabra), French (chèvre)
- And more...

## Customization

### Adding New Templates

To add a new template, edit `src/utils/templates.ts`:

```typescript
export const SPEECH_TEMPLATES: SpeechTemplate[] = [
  // ... existing templates
  {
    id: 'newTemplate',
    name: 'New Template',
    description: 'Description of what this template does',
    structure: 'Template structure with {placeholders}',
    example: 'Example output using the template'
  }
];
```

### Adding New Languages

To add a new language, update the `getAnimalWordInLanguage` function in `src/utils/generateAnimalSpeech.ts`:

```typescript
const getAnimalWordInLanguage = (animalId: string, languageCode: string): string => {
  const animalWords: Record<string, Record<string, string>> = {
    cow: {
      hi: 'gaye',
      es: 'vaca',
      fr: 'vache',
      de: 'kuh' // New German translation
    },
    // ... other animals
  };
  
  return animalWords[animalId]?.[languageCode] || animalId;
};
```

### Adding New Voices

To add new TTS voices, update the `voices` object in `src/utils/generateAnimalSpeech.ts`:

```typescript
const voices = {
  en: {
    cow: "alloy",
    // ... existing voices
  },
  hi: {
    cow: "coral",
    // ... existing voices
  },
  de: { // New language
    cow: "nova",
    goat: "echo",
    // ... other animals
  }
};
```

## Demo

Visit `/template-demo` to see:
- Available templates
- Session state
- Animal interaction history
- Template usage statistics

## Benefits

1. **Consistent Quality**: Structured prompts ensure consistent output
2. **Variety**: Template rotation prevents repetition
3. **Educational**: Each template serves a specific learning purpose
4. **Trackable**: Session state provides insights into usage patterns
5. **Maintainable**: Easy to add/modify templates and languages

## Migration from Old System

The old `generateAnimalVoice` function is still available for backward compatibility but logs a deprecation warning. New code should use `getAnimalLine` with the template system.

## Troubleshooting

### Common Issues

1. **All templates used**: The system automatically resets when all templates are used
2. **Language not supported**: Check the `getAnimalWordInLanguage` function for supported languages
3. **Voice not found**: Verify the voice mapping in the `voices` object

### Debug Information

The system logs detailed information about:
- Template selection
- GPT API calls
- TTS generation
- Session state changes

Check the browser console for debugging information.
