// Ruta: /app/components/games/MemoryGame.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import './MemoryGame.css';

const LOSING_ICON = '💀';
const LOSING_TYPE = 'LOSE'; // Usamos un tipo_id para la calavera

// Función para mezclar el array
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function MemoryGame({ gameState, result, onPlay, onAnimationComplete, prizes = [] }) {
  
  const [cards, setCards] = useState([]);
  const [canFlip, setCanFlip] = useState(false);
  const hasGameBeenSetup = useRef(false);

  useEffect(() => {
    // Estado inicial: 12 cartas boca abajo
    if (gameState === 'ready') {
      hasGameBeenSetup.current = false;
      setCards(Array(12).fill(null).map((_, i) => ({ id: i, type: 'hidden', icon: '?', isFlipped: false })));
      setCanFlip(false);
    }

    // Cuando el backend responde, armamos el mazo "arreglado"
    if (gameState === 'finished' && result && !hasGameBeenSetup.current) {
      hasGameBeenSetup.current = true;
      let prizeDeck = [];
      
      // 1. Definir los 4 tipos de cartas que habrá en el mazo
      const configuredPrizes = prizes.map(p => p.name); // ["500 fichas", "3000 fichas"]
      let typesInDeck = [];

      if (result.result === 'win') {
        // GANÓ: El tipo ganador + 2 premios falsos + 1 calavera
        typesInDeck.push(result.prize); // ej: "500 fichas"
        
        let fakes = configuredPrizes.filter(p => p !== result.prize); // ej: ["3000 fichas"]
        typesInDeck.push(fakes[0] || LOSING_TYPE); // "3000 fichas"
        typesInDeck.push(fakes[1] || LOSING_TYPE); // "LOSE"
        typesInDeck.push(LOSING_TYPE); // "LOSE"

      } else {
        // PERDIÓ: El tipo perdedor + 3 premios falsos
        typesInDeck.push(LOSING_TYPE); // "LOSE"
        typesInDeck.push(configuredPrizes[0] || 'fake1');
        typesInDeck.push(configuredPrizes[1] || 'fake2');
        typesInDeck.push(configuredPrizes[2] || 'fake3');
      }

      // 2. Limpiamos duplicados (por si 'LOSE' estaba en los fakes)
      // y nos aseguramos de tener 4 tipos únicos
      let finalTypes = [...new Set(typesInDeck)]; // ej: ["500 fichas", "3000 fichas", "LOSE"]
      
      // Rellenamos si faltan tipos
      while (finalTypes.length < 4) {
        finalTypes.push(`fake${finalTypes.length}`);
      }

      // 3. Creamos 3 cartas de cada uno de los 4 tipos
      finalTypes.slice(0, 4).forEach(type => {
        let icon = (type === LOSING_TYPE || type.startsWith('fake')) ? LOSING_ICON : type;
        prizeDeck.push({ type: type, icon: icon });
        prizeDeck.push({ type: type, icon: icon });
        prizeDeck.push({ type: type, icon: icon });
      });

      // 4. Mezclamos el mazo final de 12 cartas
      const finalDeck = shuffle(prizeDeck).map((card, i) => ({
        id: i,
        type: card.type,
        icon: card.icon,
        isFlipped: false,
      }));
      
      setCards(finalDeck);
      setCanFlip(true); // El jugador puede empezar a voltear
    }
    
  }, [gameState, result, prizes]);

  // Lógica para voltear las cartas
  const handleCardClick = (clickedIndex) => {
    if (!canFlip || cards[clickedIndex].isFlipped || gameState !== 'finished') return;

    const newCards = [...cards];
    newCards[clickedIndex].isFlipped = true;
    setCards(newCards);
    
    checkBoardForWinner(newCards);
  };

  // Función que revisa si hay 3 cartas iguales
  const checkBoardForWinner = (currentCards) => {
    const counts = {};
    
    currentCards.forEach(card => {
      if (card.isFlipped) {
        counts[card.type] = (counts[card.type] || 0) + 1;
      }
    });

    // Revisa si algún contador llegó a 3
    for (const type in counts) {
      if (counts[type] === 3) {
        // ¡Encontró 3 iguales!
        setCanFlip(false); // Bloquea el tablero, el juego terminó
        
        setTimeout(() => {
          if (onAnimationComplete) {
            onAnimationComplete(); // Avisa a la página principal que muestre el cartel
          }
        }, 800);
        
        return; // Deja de revisar
      }
    }
  };
  
  return (
    <div className="memory-game-container">
      <div className="memory-grid">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`card ${card.isFlipped ? 'is-flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back" style={{ backgroundColor: card.isFlipped ? '#f0f0f0' : '#ccc' }}>
                <span className={card.icon === LOSING_ICON ? 'card-icon' : 'card-text'}>
                  {card.icon === '?' ? '' : card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {gameState === 'ready' && (
        <button
          onClick={onPlay}
          className="play-button memory-button"
        >
          Repartir Cartas
        </button>
      )}
    </div>
  );
}