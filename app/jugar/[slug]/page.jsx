// Ruta: /app/(public)/jugar/[slug]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SlotMachineGame from '../../components/games/SlotMachineGame';
import WheelOfFortuneGame from '../../components/games/WheelOfFortuneGame';
import TreasureChestsGame from '../../components/games/TreasureChestsGame';
import PlinkoGame from '../../components/games/PlinkoGame';
import ScratchCardGame from '../../components/games/ScratchCardGame';
import CrocodileRaceGame from '../../components/games/CrocodileRaceGame';
import MemoryGame from '../../components/games/MemoryGame'; // <-- 1. IMPORTAR

export default function GamePage() {
    const params = useParams();
    const { slug } = params;

    const [playerUsername, setPlayerUsername] = useState('');
    const [gameData, setGameData] = useState(null);
    const [gameState, setGameState] = useState('ready');
    const [result, setResult] = useState(null);
    const [showResultBox, setShowResultBox] = useState(false);
    const [isLoadingGame, setIsLoadingGame] = useState(true);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('playerUsername');
        if (storedUsername) {
            setPlayerUsername(storedUsername);
        } else {
            window.location.href = '/ingresar';
        }

        if (slug) {
          const fetchGameData = async () => {
            setIsLoadingGame(true);
            try {
              const res = await fetch(`/api/games/${slug}`);
              if (res.ok) {
                const data = await res.json();
                setGameData(data);
              }
            } catch (error) {
              console.error("Error al cargar datos del juego:", error);
            } finally {
              setIsLoadingGame(false);
            }
          };
          fetchGameData();
        }
    }, [slug]);

    const handlePlay = async () => {
        if (gameState !== 'ready') return;
        setResult(null);
        setShowResultBox(false);
        setGameState('loading'); // 'loading' significa "juego en curso"

        try {
            const res = await fetch(`/api/play/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerUsername: playerUsername || 'Tester' }), // Añadido un fallback
            });
            const data = await res.json();
            
            setResult(data);
            setGameState('finished'); // El backend ha respondido, el mazo está listo
            sessionStorage.removeItem('playerUsername');

        } catch (error) {
            console.error("Error en handlePlay:", error);
            setGameState('ready');
        }
    };

    const handleAnimationComplete = () => {
      setShowResultBox(true);
    };

    const renderGameComponent = () => {
      switch (slug) {
        case 'tragamonedas-fortuna':
            return <SlotMachineGame 
                      gameState={gameState} 
                      result={result} 
                      onPlay={handlePlay} 
                      onAnimationComplete={handleAnimationComplete}
                      prizes={gameData?.prizes || []}
                    />;
        case 'rueda-premios':
            return <WheelOfFortuneGame 
                      gameState={gameState} 
                      result={result} 
                      onPlay={handlePlay} 
                      prizes={gameData?.prizes || []}
                      onAnimationComplete={handleAnimationComplete}
                    />;
        case 'llave-maestra': // Reemplazamos 'cofres-tesoro'
            return <TreasureChestsGame 
                      gameState={gameState} 
                      result={result} 
                      onPlay={handlePlay} 
                      onAnimationComplete={handleAnimationComplete}
                    />;
        case 'cascada-suerte':
             if(gameState === 'finished' && !showResultBox) setTimeout(handleAnimationComplete, 3500);
            return <PlinkoGame gameState={gameState} result={result} onPlay={handlePlay} />;
        case 'raspadita-magica':
            return <ScratchCardGame 
                      gameState={gameState} 
                      result={result} 
                      onPlay={handlePlay} 
                      onAnimationComplete={handleAnimationComplete} 
                    />;
        case 'carrera-cocodrilos':
            return <CrocodileRaceGame 
                      gameState={gameState} 
                      result={result} 
                      onPlay={handlePlay} 
                      onAnimationComplete={handleAnimationComplete} 
                    />;
        // --- ¡NUEVO JUEGO AÑADIDO! ---
        case 'pares-ganadores': // <-- 2. AÑADIR CASO
            return <MemoryGame 
                      gameState={gameState} 
                      result={result}
                      onPlay={handlePlay}
                      onAnimationComplete={handleAnimationComplete}
                      prizes={gameData?.prizes || []}
                    />;
        default:
            return <div className="text-red-500">Juego no encontrado</div>;
      }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {isLoadingGame && (
              <div className="text-2xl text-yellow-400 animate-pulse">
                Cargando juego...
              </div>
            )}
            {!isLoadingGame && playerUsername && gameData && (
                <>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
                        {gameData.name}
                    </h1>
                    <p className="text-lg text-gray-300 mb-6">¡Hola, {playerUsername}! Encuentra 3 cartas iguales.</p>
                    <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl border border-yellow-700 flex justify-center">
                        {renderGameComponent()}
                    </div>
                    {showResultBox && result && (
                         <div className="mt-8 bg-gray-700 p-6 rounded-lg shadow-xl animate-fade-in border-2 border-green-500 w-full max-w-xl text-center">
                            {result.result === 'win' ? (
                                <>
                                    <h2 className="text-3xl font-bold text-green-400 mb-2">¡Felicitaciones!</h2>
                                    <p className="text-xl">Has ganado: <span className="font-extrabold text-white">{result.prize}</span></p>
                                    <div className="mt-4 p-3 bg-gray-900 border border-dashed border-green-500 rounded-lg">
                                        <p className="text-sm text-gray-300">Presenta este código al cajero:</p>
                                        <p className="text-3xl font-mono font-bold text-green-300 tracking-widest mt-2">{result.prizeCode}</p>
                                    </div>
                                </>
                            ) : (
                                <h2 className="text-3xl font-bold text-red-400">¡Mejor suerte la próxima vez!</h2>
                            )}
                            <Link href="/jugar" className="inline-block mt-8 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-200">
                                Volver a Elegir Juego
                            </Link>
                        </div>
                    )}
                </>
            )}
            {/* Fallback si el usuario no está logueado pero el juego carga */}
            {!isLoadingGame && !playerUsername && gameData && (
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
                        {gameData.name}
                    </h1>
                    <p className="text-lg text-gray-300 mb-6">Por favor, ingresa con tu código maestro para probar.</p>
                    {renderGameComponent()}
                    {showResultBox && ( 
                        <div className="text-2xl text-red-400 mt-4">Modo de prueba. El resultado real se mostraría aquí.</div> 
                    )}
                </div>
            )}
        </div>
    );
}