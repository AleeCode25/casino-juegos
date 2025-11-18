// Ruta: /app/components/games/TreasureChestsGame.jsx
"use client";

import React, { useState } from 'react';
import './TreasureChestsGame.css'; // Usaremos un nuevo CSS

const KEYS = [
  { id: 1, name: 'Llave de Oro', icon: '🔑' },
  { id: 2, name: 'Llave de Rubí', icon: '🔑' },
  { id: 3, name: 'Llave de Hueso', icon: '🔑' },
  { id: 4, name: 'Llave de Esmeralda', icon: '🔑' },
  { id: 5, name: 'Llave de Plata', icon: '🔑' },
];

export default function TreasureChestsGame({ gameState, result, onPlay, onAnimationComplete }) {
  
  const [selectedKey, setSelectedKey] = useState(null); // Qué llave se eligió
  const [isAnimating, setIsAnimating] = useState(false); // Para controlar la animación

  const handleKeyClick = (keyId) => {
    // Solo podemos jugar si el juego está listo
    if (gameState !== 'ready') return;

    setSelectedKey(keyId);
    setIsAnimating(true);
    onPlay(); // Llama a la API para que decida el premio
  };

  // Esta lógica se activa cuando el juego vuelve como 'finished'
  const isWinner = gameState === 'finished' && result?.result === 'win';
  const animationClass = isAnimating 
    ? (isWinner ? 'key-success' : 'key-fail') 
    : '';

  return (
    <div className="chest-game-container">
      
      {/* 1. El Cofre */}
      <div className={`chest-wrapper ${isWinner ? 'chest-open' : ''}`}>
        <div className="chest-base"></div>
        <div className="chest-lid"></div>
        <div className="chest-lock"></div>
      </div>

      {/* 2. Las Llaves */}
      <div className="keys-container">
        {KEYS.map((key) => (
          <button
            key={key.id}
            className={`key-button 
              ${selectedKey === key.id ? animationClass : ''}
              ${(isAnimating && selectedKey !== key.id) ? 'key-hidden' : ''}
            `}
            onClick={() => handleKeyClick(key.id)}
            disabled={gameState !== 'ready'}
          >
            {key.icon}
          </button>
        ))}
      </div>
    </div>
  );
}