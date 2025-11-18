// Ruta: /app/(public)/jugar/page.jsx
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Game from '@/models/Game';

// Esta función se ejecuta en el servidor para obtener los juegos
async function getActiveGames() {
  await dbConnect();
  const games = await Game.find({ isActive: true });
  // Convertimos a objeto simple para pasarlo del servidor al cliente
  return JSON.parse(JSON.stringify(games));
}

export default async function JugarPage() {
  const games = await getActiveGames();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-2">Elige tu Juego</h1>
      <p className="text-lg text-gray-400 mb-10">Tienes una oportunidad. ¡Mucha suerte!</p>

      <div className="flex flex-wrap justify-center gap-8">
  {games.map(game => (
          <Link
            key={game._id}
            href={`/jugar/${game.slug}`}
            className="bg-gray-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-cyan-400"
          >
            <div className="text-6xl mb-4">
              {/* Puedes añadir un emoji o un ícono para cada juego */}
              {game.slug.includes('tragamonedas') && '🎰'}
              {game.slug.includes('rueda') && '🎡'}
              {game.slug.includes('cofres') && '🗝️'}
              {game.slug.includes('cascada') && '🪙'}
              {game.slug.includes('raspadita') && '🎫'} {/* 👈 AÑADE ESTA LÍNEA */}
              {game.slug.includes('carrera') && '🐊'} {/* <-- NUEVA LÍNEA */}
              {game.slug.includes('pares-ganadores') && '🃏'} {/* <-- NUEVA LÍNEA */}
            </div>
            <h2 className="text-2xl font-bold text-cyan-400">{game.name}</h2>
            <p className="text-gray-400 mt-2">{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}