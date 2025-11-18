// Ruta: /app/components/GameEditor.jsx
"use client";
import { useState, useEffect } from 'react';

export default function GameEditor() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  const fetchGames = () => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchGames();
  }, []);

  const handleEditClick = (game) => {
    const gameCopy = JSON.parse(JSON.stringify(game));
    if (!gameCopy.prizes) {
      gameCopy.prizes = [];
    }
    setSelectedGame(gameCopy);
  };

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...selectedGame.prizes];
    if (field === 'probability' || field === 'stock') {
      newPrizes[index][field] = Number(value);
    } else {
      newPrizes[index][field] = value;
    }
    setSelectedGame({ ...selectedGame, prizes: newPrizes });
  };

  const addPrize = () => {
    const newPrizes = [...selectedGame.prizes, { name: 'Nuevo Premio', probability: 5, stock: -1 }];
    setSelectedGame({ ...selectedGame, prizes: newPrizes });
  };

  const removePrize = (index) => {
    const newPrizes = selectedGame.prizes.filter((_, i) => i !== index);
    setSelectedGame({ ...selectedGame, prizes: newPrizes });
  };

  const handleSave = async () => {
    const { _id, ...gameData } = selectedGame;
    await fetch(`/api/games/${_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    });
    setSelectedGame(null);
    fetchGames();
  };

  if (loading) return <p>Cargando juegos...</p>;

  if (selectedGame) {
    const totalProbability = selectedGame.prizes.reduce((sum, p) => sum + p.probability, 0);
    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <h3 className="text-xl font-bold text-gray-800">Editando: {selectedGame.name}</h3>
        <div className="mt-4 space-y-4">
          <div className="flex gap-2 font-bold text-xs text-gray-500">
            <span className="flex-grow">Nombre del Premio</span>
            <span className="w-20 text-center">%</span>
            <span className="w-20 text-center">Stock</span>
            <span className="w-10"></span>
          </div>
          {selectedGame.prizes.map((prize, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={prize.name}
                onChange={(e) => handlePrizeChange(index, 'name', e.target.value)}
                className="flex-grow p-2 border rounded text-gray-700"
              />
              <input
                type="number"
                value={prize.probability}
                onChange={(e) => handlePrizeChange(index, 'probability', e.target.value)}
                className="w-20 p-2 border rounded text-gray-700"
              />
              {/* --- ¡NUEVO CAMPO STOCK! --- */}
              <input
                type="number"
                value={prize.stock}
                onChange={(e) => handlePrizeChange(index, 'stock', e.target.value)}
                className="w-20 p-2 border rounded text-gray-700"
                title="-1 para infinito"
              />
              <button onClick={() => removePrize(index)} className="bg-red-500 text-white px-3 py-2 rounded">X</button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Usa -1 en Stock para premios infinitos.</p>
        <button onClick={addPrize} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">+ Añadir Premio</button>
        
        <div className={`mt-4 font-bold ${totalProbability > 100 ? 'text-red-500' : 'text-gray-700'}`}>
          Probabilidad Total de Ganar: {totalProbability.toFixed(1)}%
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Guardar Cambios</button>
          <button onClick={() => setSelectedGame(null)} className="bg-gray-300 text-gray-800 px-6 py-2 rounded">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md">
      <h2 className="text-xl font-bold text-gray-800">Editor de Premios</h2>
      <ul className="mt-4 space-y-2">
        {games.map(game => (
          <li key={game._id} className="flex justify-between items-center p-2 border-b">
            <span>{game.name}</span>
            <button onClick={() => handleEditClick(game)} className="bg-blue-500 text-white px-4 py-1 rounded">Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}