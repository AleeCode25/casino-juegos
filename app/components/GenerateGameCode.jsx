// Ruta: /app/components/GenerateGameCode.jsx
"use client";

import { useState } from 'react';

export default function GenerateGameCode() {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedCode(null);

    try {
      const res = await fetch('/api/game-codes', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al generar el código');
      }

      setGeneratedCode(data.code);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800">Generar Código de Juego</h2>
      <p className="mt-2 text-gray-500">Crea un nuevo código para que un jugador pueda acceder a los juegos.</p>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="mt-4 w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Generando...' : 'Generar Nuevo Código'}
      </button>
      {generatedCode && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg text-center">
          <p className="text-sm text-green-700">Código Generado:</p>
          <p className="text-2xl font-mono font-bold text-green-800 tracking-widest">{generatedCode}</p>
        </div>
      )}
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}