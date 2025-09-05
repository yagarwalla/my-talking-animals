export const SPEECH_TEMPLATES = [
  {
    id: 'intro',
    name: 'Introduction',
    description: 'Animal introduces itself and teaches its name in the secondary language',
    structure: 'Hello, I am a {animal}. In {lang}, I\'m called {word}. Can you say {word}?',
    example: 'Hello, I am a cow. In Hindi, I\'m called gaye. Can you say gaye?'
  },
  {
    id: 'funFact',
    name: 'Fun Fact',
    description: 'Animal shares an interesting fact about itself and reinforces the secondary language word',
    structure: 'Did you know {fun fact}? In {lang}, I\'m {word}. Try saying it!',
    example: 'Did you know I give milk? In Hindi, I\'m gaye. Try saying it!'
  },
  {
    id: 'challenge',
    name: 'Challenge',
    description: 'Animal gives the child a fun task and teaches a phrase in the secondary language',
    structure: 'Can you {task}? In {lang}, we say {phrase}. Repeat with me!',
    example: 'Can you jump like me? In Hindi, we say koodo. Repeat with me!'
  },
  {
    id: 'praise',
    name: 'Praise',
    description: 'Animal celebrates the child\'s success and encourages them',
    structure: 'Yay! You said it! Great job! You\'re learning {lang} so well!',
    example: 'Yay! You said it! Great job! You\'re learning Hindi so well!'
  },
  {
    id: 'question',
    name: 'Question',
    description: 'Animal asks the child a simple question and teaches vocabulary',
    structure: 'What color am I? I\'m {color}! In {lang}, we say {word}. Can you remember?',
    example: 'What color am I? I\'m brown! In Hindi, we say gaye. Can you remember?'
  }
];

export const getRandomTemplate = (usedTemplates) => {
  const availableTemplates = SPEECH_TEMPLATES.filter(template => 
    !usedTemplates.includes(template.id)
  );
  
  if (availableTemplates.length === 0) {
    // If all templates used, reset and pick random
    return SPEECH_TEMPLATES[Math.floor(Math.random() * SPEECH_TEMPLATES.length)];
  }
  
  return availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
};

export const getTemplatePrompt = (template, animal, language, animalWord) => {
  return `Fill in the "${template.name}" template for a ${animal}, speaking to a 3-year-old. 
Secondary language is ${language}. Animal word in that language is ${animalWord}.

Template structure: ${template.structure}

Requirements:
- Keep it fun, short (1-2 sentences), and age-appropriate
- Use the exact template structure provided
- Make it engaging for a toddler
- Include the secondary language word naturally

Output only the complete response, no explanations.`;
};

