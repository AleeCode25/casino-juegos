// Ruta: /app/components/games/CrocodileRaceGame.jsx
"use client";

import React, { useState, useEffect } from 'react';
import './CrocodileRaceGame.css';

const CROCODILES = [
  { id: 0, name: 'Rojo', color: '#e74c3c' },
  { id: 1, name: 'Verde', color: '#2ecc71' },
  { id: 2, name: 'Azul', color: '#3498db' },
];

const RACE_DURATION = 3000; // 3 segundos

export default function CrocodileRaceGame({ gameState, result, onPlay, onAnimationComplete }) {
  
  const [selectedCrocodile, setSelectedCrocodile] = useState(null);
  const [positions, setPositions] = useState([0, 0, 0]);

  // --- INICIO DE LA CORRECCIÓN ---

  // Efecto 1: Se encarga SÓLO de la animación de "terminado"
  // Depende de 'result' y 'selectedCrocodile' para saber quién debe ganar.
  useEffect(() => {
    if (gameState === 'finished' && result) {
      
      let winnerIndex;
      if (result.result === 'win') {
        winnerIndex = selectedCrocodile;
      } else {
        const otherCrocodiles = [0, 1, 2].filter(c => c !== selectedCrocodile);
        winnerIndex = otherCrocodiles[Math.floor(Math.random() * otherCrocodiles.length)];
      }

      const newPositions = [0, 0, 0];
      newPositions[winnerIndex] = 100;
      newPositions.forEach((pos, i) => {
        if (i !== winnerIndex) newPositions[i] = Math.random() * 30 + 50;
      });
      
      setPositions(newPositions);

      setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, RACE_DURATION);
    }
  }, [gameState, result, selectedCrocodile, onAnimationComplete]);

  // Efecto 2: Se encarga SÓLO de resetear el juego cuando vuelve a 'ready'
  // Este efecto NO depende de 'selectedCrocodile', rompiendo el bucle.
  useEffect(() => {
    if (gameState === 'ready') {
      setSelectedCrocodile(null);
      setPositions([0, 0, 0]);
    }
  }, [gameState]);

  // --- FIN DE LA CORRECCIÓN ---

  const handleSelect = (crocId) => {
    if (gameState === 'ready') {
      // Ahora, cuando esto se ejecute, NO disparará el Efecto 2
      setSelectedCrocodile(crocId);
    }
  };

  const handlePlayClick = () => {
    if (selectedCrocodile !== null) {
      onPlay();
    }
  };

  const getButtonText = () => {
    if (gameState === 'ready') return '¡CORRER!';
    if (gameState === 'loading') return '...';
    if (gameState === 'finished') return 'JUGADO';
    return '¡CORRER!';
  };

  return (
    <div className="race-container">
      <div className="race-track">
        {CROCODILES.map((croc, index) => (
          <div key={croc.id} className="race-lane">
            <div 
              className="crocodile"
              style={{ 
                left: `${positions[index]}%`,
                backgroundColor: croc.color,
                // La transición solo se aplica cuando el juego NO está 'ready'
                // (es decir, en 'loading' y 'finished')
                transition: gameState !== 'ready' ? `left ${RACE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
              }}
            >
              🐊
            </div>
          </div>
        ))}
      </div>

      <div className="selection-area">
        <p>Elige tu cocodrilo:</p>
        <div className="selection-buttons">
          {CROCODILES.map(croc => (
            <button
              key={croc.id}
              className={`croc-select-button ${selectedCrocodile === croc.id ? 'selected' : ''}`}
              style={{ '--croc-color': croc.color }}
              onClick={() => handleSelect(croc.id)}
              disabled={gameState !== 'ready'}
            >
              {croc.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handlePlayClick}
        disabled={selectedCrocodile === null || gameState !== 'ready'}
        className="play-button race-button"
      >
        {getButtonText()}
      </button>
    </div>
  );
}