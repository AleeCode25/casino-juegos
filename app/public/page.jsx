"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/game-codes/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code }),
      });

      if (res.ok) {
        router.push('/jugar');
      } else {
        const data = await res.json();
        setError(data.message || 'Ocurrió un error.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-400">Ingresa para Jugar</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-3 border bg-gray-700 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Código de Juego"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="p-3 border bg-gray-700 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button type="submit" disabled={loading} className="p-3 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700 disabled:bg-gray-500">
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
          {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        </form>
      </div>
    </main>
  );
}