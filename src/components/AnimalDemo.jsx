import React from 'react';
import AnimalCard from './AnimalCard';

const AnimalDemo = () => {
  const animals = ['Cow', 'Pig', 'Goat', 'Sheep', 'Hen', 'Horse'];

  const handleAnimalClick = (animalName) => {
    console.log(`${animalName} was clicked!`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Animal Speech Generation Demo
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {animals.map((animal) => (
          <AnimalCard
            key={animal}
            animalName={animal}
            onAnimalClick={handleAnimalClick}
          />
        ))}
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3>How to Use:</h3>
        <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>Set up your environment variables in a <code>.env</code> file</li>
          <li>Add animal sound MP3 files to <code>/public/sounds/</code></li>
          <li>Click on any animal to hear its sound and generated speech!</li>
        </ol>
      </div>
    </div>
  );
};

export default AnimalDemo;
