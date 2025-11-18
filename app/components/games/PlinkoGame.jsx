// Ruta: /app/components/games/PlinkoGame.jsx
"use client";

import React from 'react';
import './PlinkoGame.css';

// Este es un componente puramente visual. No tiene lógica propia.
export default function PlinkoGame({ gameState, result, onPlay }) {
  const animationClass = result?.result === 'win' ? 'drop-win' : 'drop-lose';

  const getButtonText = () => {
    if (gameState === 'ready') return 'SOLTAR FICHA';
    if (gameState === 'loading') return '...';
    if (gameState === 'finished') return 'JUGADO';
    return 'SOLTAR FICHA';
  };

  return (
    <div className="plinko-container">
      <div className="plinko-board">
        {/* La ficha solo se muestra durante el estado 'loading' */}
        {gameState === 'loading' && <div className={`plinko-chip ${animationClass}`}></div>}

        {/* Las clavijas */}
        <div className="peg" style={{top: '15%', left: '50%'}}></div>
        <div className="peg" style={{top: '30%', left: '30%'}}></div>
        <div className="peg" style={{top: '30%', left: '70%'}}></div>
        <div className="peg" style={{top: '45%', left: '10%'}}></div>
        <div className="peg" style={{top: '45%', left: '50%'}}></div>
        <div className="peg" style={{top: '45%', left: '90%'}}></div>
        <div className="peg" style={{top: '60%', left: '30%'}}></div>
        <div className="peg" style={{top: '60%', left: '70%'}}></div>
        <div className="peg" style={{top: '75%', left: '10%'}}></div>
        <div className="peg" style={{top: '75%', left: '50%'}}></div>
        <div className="peg" style={{top: '75%', left: '90%'}}></div>

        {/* Las ranuras */}
        <div className="slot lose"></div>
        <div className="slot win"><span>Premio</span></div>
        <div className="slot lose"></div>
      </div>
       <button
        onClick={onPlay}
        disabled={gameState !== 'ready'}
        className="play-button plinko-button"
      >
        {getButtonText()}
      </button>
    </div>
  );
}