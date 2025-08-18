import React from 'react';

const AnimalCard = ({ animal, onClick, isSelected }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(animal);
    }
  };

  return (
    <div 
      className={`animal-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="animal-card-image">
        <img 
          src={`/images/animals/${animal.type}.png`} 
          alt={animal.name}
          className="animal-sprite"
        />
      </div>
      <div className="animal-card-info">
        <h3 className="animal-name">{animal.name}</h3>
        <p className="animal-type">{animal.type}</p>
        <p className="animal-description">
          Click to hear {animal.name} talk!
        </p>
      </div>
      <div className="animal-card-actions">
        <button 
          className="animal-card-button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          🗣️ Talk
        </button>
      </div>
    </div>
  );
};

export default AnimalCard;
