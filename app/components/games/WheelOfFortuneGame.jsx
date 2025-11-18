// Ruta: /app/components/games/WheelOfFortuneGame.jsx
"use client";

import React, { useState, useEffect } from 'react';
import './WheelOfFortuneGame.css'; // Volvemos a usar nuestro CSS

// Colores por defecto para los segmentos
const defaultColors = [
  "#8e44ad", "#2980b9", "#e67e22", "#27ae60", 
  "#f1c40f", "#c0392b", "#d35400", "#16a085"
];

export default function WheelOfFortuneGame({ gameState, result, onPlay, prizes = [], onAnimationComplete }) {
    
    // 1. Creación Dinámica de la Ruleta
    const prizeSegments = (prizes.length > 0 ? prizes : Array(8).fill({ name: "Sin Premio" }))
      .map((prize, i) => ({
        text: prize.name,
        color: defaultColors[i % defaultColors.length],
        prizeKey: prize.name
      }));

    const totalSegments = prizeSegments.length;
    const segmentAngle = 360 / totalSegments;
    
    const [rotation, setRotation] = useState(0);
    const [winningSegment, setWinningSegment] = useState(null); // <-- NUEVO ESTADO

    useEffect(() => {
        if (gameState === 'loading') {
            setWinningSegment(null); // Limpiamos el ganador anterior
            // La ruleta gira a una posición aleatoria, ya no nos importa el resultado
            const randomSpin = (Math.floor(Math.random() * 5) + 8) * 360;
            const randomStop = Math.random() * 360;
            setRotation(prev => prev + randomSpin + randomStop);
        }

        if (gameState === 'finished' && result) {
            // Cuando el juego termina, encontramos el índice del premio real
            let targetSegmentIndex;
            if (result.result === 'win') {
                targetSegmentIndex = prizeSegments.findIndex(p => p.prizeKey && result.prize.includes(p.prizeKey));
            } else {
                const losingSegmentsIndexes = prizeSegments.map((p, i) => (!p.prizeKey || p.text === "Sin Premio" ? i : -1)).filter(i => i !== -1);
                targetSegmentIndex = losingSegmentsIndexes[Math.floor(Math.random() * losingSegmentsIndexes.length)];
            }
            if (targetSegmentIndex === -1 || targetSegmentIndex === undefined) targetSegmentIndex = 0;
            
            // ¡AQUÍ ESTÁ LA MAGIA!
            // No cambiamos la rotación. Solo le decimos al estado
            // cuál es el segmento que DEBE resaltarse.
            setWinningSegment(targetSegmentIndex);
            
            // Le avisamos a la página principal que la animación terminó
            // (Le damos 1 segundo extra para que el jugador vea el resaltado)
            setTimeout(() => {
                if (onAnimationComplete) onAnimationComplete();
            }, 1000);
        }
    }, [gameState, result, prizes, onAnimationComplete]);

    const getButtonText = () => {
        if (gameState === 'ready') return 'GIRAR RUEDA';
        if (gameState === 'loading') return 'GIRANDO...';
        if (gameState === 'finished') return 'JUGADO';
        return 'GIRAR RUEDA';
    }

    return (
        <div className="wheel-container">
            <div className="wheel-pointer">▼</div>
            <div 
                className="wheel"
                style={{ 
                    transform: `rotate(${rotation}deg)`,
                }}
            >
                {prizeSegments.map((prize, index) => (
                    <div 
                        key={index} 
                        // Aplicamos la clase 'highlight' si es el ganador Y el juego terminó
                        className={`segment ${gameState === 'finished' && index === winningSegment ? 'highlight' : ''}`}
                        style={{
                            transform: `rotate(${index * segmentAngle}deg)`,
                            backgroundColor: prize.color,
                        }}
                    >
                        <span 
                          className="segment-text" 
                          style={{ 
                            transform: `rotate(${segmentAngle / 2}deg)`
                          }}
                        >
                          {prize.text}
                        </span>
                    </div>
                ))}
            </div>
            <button
                onClick={onPlay}
                disabled={gameState !== 'ready'}
                className="play-button wheel-button"
            >
                {getButtonText()}
            </button>
        </div>
    );
}