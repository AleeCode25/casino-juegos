// Ruta: /app/components/CreateUserForm.jsx
"use client";

import { useState } from 'react';

export default function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al crear el usuario');
      }
      setResult(data.message);
      setEmail(''); // Limpiar el formulario
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md">
      <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Cajero</h2>
      <p className="mt-2 text-gray-500">Los nuevos usuarios tendrán el rol de "Moderador" por defecto.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email del nuevo usuario"
          required
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña temporal"
          required
          minLength={6}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-center">
          <p className="font-semibold text-green-800">{result}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg text-center">
          <p className="font-semibold text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}