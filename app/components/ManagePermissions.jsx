// Ruta: /app/components/ManagePermissions.jsx
"use client";
import { useState, useEffect } from 'react';

export default function ManagePermissions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (userId, currentStatus) => {
    setUsers(users.map(u => u._id === userId ? { ...u, canManageGames: !currentStatus } : u));
    await fetch(`/api/users/${userId}/permissions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canManageGames: !currentStatus }),
    });
  };

  // --- ¡NUEVA FUNCIÓN DE ELIMINAR! ---
  const handleDelete = async (userId, userEmail) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${userEmail}? Esta acción no se puede deshacer.`)) {
      setUsers(users.filter(u => u._id !== userId)); // Optimista
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      fetchUsers(); // Re-sincroniza
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md">
      <h2 className="text-xl font-bold text-gray-800">Gestionar Cajeros</h2>
      <ul className="mt-4 space-y-3">
        {users.map((user) => (
          <li key={user._id} className="flex justify-between items-center p-2 border-b">
            <span className="text-sm">{user.email}</span>
            <div className="flex items-center gap-2">
              <label title="Permiso para gestionar juegos" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.canManageGames || false}
                  onChange={() => handleToggle(user._id, user.canManageGames)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
              <button onClick={() => handleDelete(user._id, user.email)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}