// Ruta: /app/components/ManageGames.jsx
"use client";

import { useState, useEffect } from 'react';

export default function ManageGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch('/api/games');
      const data = await res.json();
      setGames(data);
      setLoading(false);
    };
    fetchGames();
  }, []);

  const handleToggle = async (gameId, currentStatus) => {
    // Actualiza el estado local inmediatamente para una mejor experiencia de usuario
    setGames(games.map(g => g._id === gameId ? { ...g, isActive: !currentStatus } : g));

    // Llama a la API para guardar el cambio
    await fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
  };

  if (loading) return <p>Cargando juegos...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md">
      <h2 className="text-xl font-bold text-gray-800">Gestionar Juegos Activos</h2>
      <ul className="mt-4 space-y-3">
        {games.map((game) => (
          <li key={game._id} className="flex justify-between items-center p-2 border-b">
            <span>{game.name}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={game.isActive}
                onChange={() => handleToggle(game._id, game.isActive)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}