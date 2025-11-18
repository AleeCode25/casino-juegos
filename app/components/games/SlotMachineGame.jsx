// Ruta: /app/components/games/SlotMachineGame.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import './SlotMachineGame.css';

// --- Símbolos (no cambian) ---
const symbols = [
  { id: 'bell', icon: '🔔', color: 'text-yellow-400' },
  { id: 'cherry', icon: '🍒', color: 'text-red-500' },
  { id: 'lemon', icon: '🍋', color: 'text-yellow-500' },
  { id: 'diamond', icon: '💎', color: 'text-cyan-400' },
  { id: 'seven', icon: '7️⃣', color: 'text-purple-500' },
];
const prizeSymbols = {
  mayor: symbols.find(s => s.id === 'diamond'),
  mediano: symbols.find(s => s.id === 'cherry'),
  pequeño: symbols.find(s => s.id === 'bell'),
};
const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];
const stopReel = (reelIndex, finalReels, currentReels) => {
  return [...currentReels].map((reel, i) => {
    if (i === reelIndex) return finalReels[i];
    return i < reelIndex ? finalReels[i] : getRandomSymbol();
  });
};

// --- INICIO DE LA MODIFICACIÓN ---
// 1. Añadimos 'onAnimationComplete' a las props que recibe el componente
export default function SlotMachineGame({ gameState, result, onPlay, onAnimationComplete }) {
// --- FIN DE LA MODIFICACIÓN ---

  const [reels, setReels] = useState([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
  const [spinningStates, setSpinningStates] = useState([false, false, false]);
  const intervals = useRef([null, null, null]);

  useEffect(() => {
    if (gameState === 'loading') {
      setSpinningStates([true, true, true]);
      intervals.current.forEach((_, i) => {
        intervals.current[i] = setInterval(() => {
          setReels(prevReels => 
            prevReels.map((reel, index) => 
              index >= i ? getRandomSymbol() : reel
            )
          );
        }, 80 + (i * 20));
      });
    }

    if (gameState === 'finished' && result) {
      let finalReels;
      if (result.result === 'win') {
        let winningSymbol;
        if (result.prize.includes('Cena')) winningSymbol = prizeSymbols.mayor;
        else if (result.prize.includes('Trago')) winningSymbol = prizeSymbols.mediano;
        else winningSymbol = prizeSymbols.pequeño;
        finalReels = [winningSymbol, winningSymbol, winningSymbol];
      } else {
        finalReels = [prizeSymbols.pequeño, prizeSymbols.pequeño, symbols.find(s => s.id === 'lemon')];
      }

      setTimeout(() => {
        clearInterval(intervals.current[0]);
        setSpinningStates([false, true, true]);
        setReels(prev => stopReel(0, finalReels, prev));
      }, 1000); 

      setTimeout(() => {
        clearInterval(intervals.current[1]);
        setSpinningStates([false, false, true]);
        setReels(prev => stopReel(1, finalReels, prev));
      }, 1800); 

      setTimeout(() => {
        clearInterval(intervals.current[2]);
        setSpinningStates([false, false, false]);
        setReels(finalReels);
        
        // --- INICIO DE LA MODIFICACIÓN ---
        // 2. Avisamos a la página principal que la animación terminó.
        // Damos una pequeña pausa de 500ms para que el jugador vea los símbolos
        // antes de que aparezca el cartel.
        setTimeout(() => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }, 500);
        // --- FIN DE LA MODIFICACIÓN ---

      }, 2500); // El último rodillo frena
    }
    
    return () => {
      intervals.current.forEach(interval => clearInterval(interval));
    };
  }, [gameState, result]);

  const getButtonText = () => {
    if (gameState === 'ready') return 'GIRAR';
    if (gameState === 'loading') return 'GIRANDO...';
    if (gameState === 'finished') return '¡JUGADO!';
    return 'GIRAR';
  };

  return (
    // ... (El JSX de retorno no cambia, lo dejo por brevedad) ...
    <div className="slot-machine-container">
      <div className="reels-display">
        {reels.map((symbol, index) => (
          <div key={index} className={`reel ${spinningStates[index] ? 'spinning' : ''}`}>
            <span className={`text-6xl ${symbol?.color || 'text-white'}`}>
              {symbol?.icon || '❓'}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={onPlay}
        disabled={gameState !== 'ready'}
        className={`spin-button ${gameState === 'ready' ? 'active' : 'disabled'}`}
      >
        {getButtonText()}
      </button>
    </div>
  );
}