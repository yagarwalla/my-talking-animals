import React, { useState } from 'react';
import { useAnimalSession } from '../contexts/AnimalSessionContext.jsx';
import { SPEECH_TEMPLATES } from '../utils/templates.js';

const TemplateDemo = () => {
  const { sessionState, resetSession } = useAnimalSession();
  const [selectedAnimal, setSelectedAnimal] = useState('cow');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  const animals = [
    { id: 'cow', name: 'Cow' },
    { id: 'goat', name: 'Goat' },
    { id: 'hen', name: 'Hen' },
    { id: 'sheep', name: 'Sheep' },
    { id: 'pig', name: 'Pig' },
    { id: 'horse', name: 'Horse' }
  ];

  const languages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ];

  const getAnimalInteraction = (animalId) => {
    return sessionState.animalInteractions[animalId];
  };

  const getTemplateName = (templateId) => {
    const template = SPEECH_TEMPLATES.find(t => t.id === templateId);
    return template ? template.name : templateId;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Animal Template System Demo
      </h1>
      
      {/* Session Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">Session Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Interactions:</span> {sessionState.totalInteractions}
          </div>
          <div>
            <span className="font-medium">Session Duration:</span> {Math.round((Date.now() - sessionState.sessionStartTime) / 1000)}s
          </div>
          <div>
            <span className="font-medium">Animals Interacted:</span> {Object.keys(sessionState.animalInteractions).length}
          </div>
        </div>
        <button
          onClick={resetSession}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reset Session
        </button>
      </div>

      {/* Template Overview */}
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 text-green-800">Available Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPEECH_TEMPLATES.map(template => (
            <div key={template.id} className="bg-white p-3 rounded border">
              <h3 className="font-semibold text-green-700">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                {template.structure}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Animal Interaction Status */}
      <div className="bg-purple-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 text-purple-800">Animal Interaction Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map(animal => {
            const interaction = getAnimalInteraction(animal.id);
            return (
              <div key={animal.id} className="bg-white p-3 rounded border">
                <h3 className="font-semibold text-purple-700">{animal.name}</h3>
                {interaction ? (
                  <div>
                    <p className="text-sm text-gray-600">
                      Interactions: {interaction.usedTemplates.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      Last: {new Date(interaction.lastInteractionTime).toLocaleTimeString()}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700">Used Templates:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {interaction.usedTemplates.map(templateId => (
                          <span
                            key={templateId}
                            className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded"
                          >
                            {getTemplateName(templateId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No interactions yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Configuration */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-yellow-800">Test Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Animal:
            </label>
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Language:
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Selected: <span className="font-medium">{animals.find(a => a.id === selectedAnimal)?.name}</span> speaking <span className="font-medium">{languages.find(l => l.code === selectedLanguage)?.name}</span></p>
          <p>Used templates: {getAnimalInteraction(selectedAnimal)?.usedTemplates.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateDemo;
