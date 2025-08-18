import React, { useState, useEffect } from 'react';
import Animal from './Animal';

const AnimalDemo = () => {
  const [animals, setAnimals] = useState([
    {
      id: 1,
      name: 'Cow',
      type: 'cow',
      x: 100,
      y: 200,
      sound: '/sounds/cow-moo.mp3',
      speech: "Moo! I'm Bessie the cow. I love eating fresh grass and giving milk. Did you know I have four stomachs? That's why I can digest grass so well!"
    },
    {
      id: 2,
      name: 'Horse',
      type: 'horse',
      x: 300,
      y: 150,
      sound: '/sounds/horse-neigh.mp3',
      speech: "Neigh! I'm Thunder the horse. I love running fast and being brushed. My mane is my pride and joy. Want to go for a ride?"
    },
    {
      id: 3,
      name: 'Pig',
      type: 'pig',
      x: 500,
      y: 250,
      sound: '/sounds/pig-oink.mp3',
      speech: "Oink! I'm Wilbur the pig. I'm actually very clean despite what people think. I love mud baths to keep cool and I'm super smart!"
    },
    {
      id: 4,
      name: 'Sheep',
      type: 'sheep',
      x: 200,
      y: 350,
      sound: '/sounds/sheep-baa.mp3',
      speech: "Baa! I'm Wooly the sheep. My wool keeps me warm in winter and gets sheared in spring. I love being in the flock with my friends!"
    },
    {
      id: 5,
      name: 'Chicken',
      type: 'chicken',
      x: 400,
      y: 400,
      sound: '/sounds/chicken-cluck.mp3',
      speech: "Cluck cluck! I'm Henrietta the chicken. I lay eggs almost every day and I love scratching in the dirt for bugs. Cock-a-doodle-doo!"
    }
  ]);

  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleCloseSpeech = () => {
    setSelectedAnimal(null);
  };

  return (
    <div className="animal-demo">
      {/* Rotate Device Overlay */}
      {!isLandscape && (
        <div className="rotate-overlay">
          <div className="rotate-content">
            <div className="rotate-icon">📱</div>
            <h1 className="rotate-title">Please Rotate Your Device</h1>
            <p className="rotate-subtitle">This demo works best in landscape mode</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="demo-content fade-in">
        <header className="demo-header">
          <h1 className="demo-title fade-in">My Talking Animals</h1>
          <p className="demo-subtitle fade-in">
            Click on any animal to hear them talk! 🗣️✨
          </p>
        </header>

        {/* Farm Scene */}
        <div className="farm-scene">
          <div className="area-scene">
            {animals.map((animal) => (
              <Animal
                key={animal.id}
                animal={animal}
                onClick={() => handleAnimalClick(animal)}
              />
            ))}
          </div>
        </div>

        {/* Speech Modal */}
        {selectedAnimal && (
          <div className="speech-modal-overlay" onClick={handleCloseSpeech}>
            <div className="speech-modal" onClick={(e) => e.stopPropagation()}>
              <div className="speech-header">
                <h3>{selectedAnimal.name} says:</h3>
                <button className="close-button" onClick={handleCloseSpeech}>
                  ✕
                </button>
              </div>
              <div className="speech-content">
                <p>{selectedAnimal.speech}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalDemo;
