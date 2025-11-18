// Ruta: /app/components/RedeemPrizeCode.jsx
"use client";

import { useState } from 'react';

export default function RedeemPrizeCode() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/prize-codes/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al canjear el código');
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800">Canjear Código de Premio</h2>
      <p className="mt-2 text-gray-500">Valida el código de un premio ganado por un jugador.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ingresar código de premio"
          required
          className="w-full px-4 py-2 border rounded-lg text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Verificando...' : 'Canjear Premio'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="font-bold text-green-800">{result.message}</p>
          <p className="text-sm text-green-700 mt-2">Usuario: <span className="font-semibold">{result.awardedToUser}</span></p>
          <p className="text-sm text-green-700">Premio: <span className="font-semibold">{result.prizeDetails}</span></p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="font-bold text-red-800">Error</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}