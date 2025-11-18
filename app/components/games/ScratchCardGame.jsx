// Ruta: /app/components/games/ScratchCardGame.jsx
"use client";

import React, { useState } from 'react';
import './ScratchCardGame.css';

const GRID_SIZE = 10;
const initialBlocks = Array(GRID_SIZE * GRID_SIZE).fill(true);

// Ya no necesita 'onAnimationComplete'
export default function ScratchCardGame({ gameState, result, onPlay }) {
  
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isScratching, setIsScratching] = useState(false);

  // Si el juego se resetea (vuelve a 'ready'), restauramos la capa gris
  if (gameState === 'ready' && blocks.some(b => !b)) {
    setBlocks(initialBlocks);
  }

  const handleScratch = (index) => {
    if (index === null || index === undefined) return;
    if (gameState !== 'finished') return;

    setBlocks(prevBlocks => {
      if (prevBlocks[index] === true) {
        const newBlocks = [...prevBlocks];
        newBlocks[index] = false;
        return newBlocks;
      }
      return prevBlocks;
    });
  };

  // --- LÓGICA DE MOUSE (ESCRITORIO) ---
  const handleMouseDown = (e, index) => {
    if (gameState !== 'finished') return;
    setIsScratching(true);
    handleScratch(index);
  };
  const handleMouseOver = (e, index) => {
    if (isScratching) handleScratch(index);
  };
  const handleMouseUp = () => {
    setIsScratching(false);
    // Ya no llamamos a onAnimationComplete aquí
  };

  // --- LÓGICA PARA TÁCTIL (CELULAR) ---
  const handleTouchStart = (e, index) => {
    if (gameState !== 'finished') return;
    e.preventDefault();
    handleScratch(index);
  };
  const handleTouchMove = (e) => {
    if (gameState !== 'finished') return;
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains('scratch-block')) {
      const index = parseInt(element.dataset.index, 10);
      handleScratch(index);
    }
  };
  const handleTouchEnd = () => {
    // Ya no llamamos a onAnimationComplete aquí
  };

  const getWinnerText = () => {
    if (gameState === 'finished') {
      if (result?.result === 'win') {
        return `¡GANASTE!\n${result.prize}`;
      }
      return "SIN PREMIO";
    }
    if (gameState === 'loading') {
      return "Preparando tarjeta..."
    }
    return "¡Raspa para Ganar!";
  }

  return (
    <div className="scratchcard-container">
      <p className="scratch-instructions">
        {gameState === 'finished' ? '¡Raspa para ver tu premio!' : 'Presiona el botón para jugar'}
      </p>
      
      <div 
        className="scratch-card"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        <div className="prize-area">
          <span className={result?.result === 'win' ? 'prize-win' : 'prize-lose'}>
            {getWinnerText()}
          </span>
        </div>
        
        <div 
          className="scratch-grid-overlay"
          onTouchMove={handleTouchMove}
          style={{
            cursor: gameState === 'finished' ? `url('/images/coin-cursor.png') 16 16, auto` : 'not-allowed',
            visibility: gameState === 'finished' ? 'visible' : 'hidden'
          }}
        >
          {blocks.map((isVisible, index) => (
            <div
              key={index}
              data-index={index}
              className={`scratch-block ${!isVisible ? 'is-scratched' : ''}`}
              onMouseDown={(e) => handleMouseDown(e, index)}
              onMouseOver={(e) => handleMouseOver(e, index)}
              onTouchStart={(e) => handleTouchStart(e, index)}
            />
          ))}
        </div>
      </div>
      
      <button
        onClick={onPlay}
        disabled={gameState !== 'ready'}
        className="play-button scratch-button"
      >
        {gameState === 'ready' ? 'RASPAR' : '¡SUERTE!'}
      </button>
    </div>
  );
}