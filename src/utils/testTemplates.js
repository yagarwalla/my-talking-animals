// Simple test to verify template system is working
import { SPEECH_TEMPLATES, getRandomTemplate, getTemplatePrompt } from './templates.js';

console.log('🧪 Testing Template System...');

// Test 1: Check if templates are loaded
console.log('✅ Templates loaded:', SPEECH_TEMPLATES.length);
SPEECH_TEMPLATES.forEach(template => {
  console.log(`  - ${template.id}: ${template.name}`);
});

// Test 2: Test template selection
const usedTemplates = ['intro'];
const selectedTemplate = getRandomTemplate(usedTemplates);
console.log('✅ Template selection test:', selectedTemplate.id);

// Test 3: Test prompt generation
const prompt = getTemplatePrompt(selectedTemplate, 'cow', 'Hindi', 'gaye');
console.log('✅ Prompt generation test:', prompt.substring(0, 100) + '...');

console.log('🎉 Template system test completed successfully!');

