// Ruta: /app/components/AdminDashboard.jsx
"use client"; // 👈 1. Convertir a Componente de Cliente

import { useState, useEffect } from 'react';

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
const getISODate = (date) => {
  return date.toISOString().split('T')[0];
}

// Componente StatCard (no cambia)
function StatCard({ title, value, loading }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {loading ? (
        <div className="h-8 w-1/3 bg-gray-200 animate-pulse mt-1"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value !== undefined ? value : '...'}</p>
      )}
    </div>
  );
}

// Componente principal del Dashboard
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Estados para los selectores de fecha
  const [startDate, setStartDate] = useState(getISODate(new Date()));
  const [endDate, setEndDate] = useState(getISODate(new Date()));

  // 3. Función para cargar las estadísticas según el rango
  const fetchStats = async (from, to) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stats?from=${from}&to=${to}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Cargar estadísticas de "hoy" la primera vez que se monta
  useEffect(() => {
    fetchStats(startDate, endDate);
  }, []); // El array vacío asegura que solo se ejecute una vez al inicio

  // 5. Función para el botón "Filtrar"
  const handleFilter = () => {
    fetchStats(startDate, endDate);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Centro de Mando</h1>
      <p className="text-gray-600 mt-2">Resumen de la actividad de la plataforma.</p>
      
      {/* --- INICIO DEL FILTRO DE FECHAS --- */}
      <div className="flex flex-wrap items-end gap-4 bg-gray-50 p-4 rounded-lg my-6 border">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Desde</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Hasta</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2"
          />
        </div>
        <button
          onClick={handleFilter}
          disabled={loading}
          // --- ¡CLASES DE ESTILO ACTUALIZADAS! ---
          className="
            relative px-6 py-2 rounded-md font-semibold text-white
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-700 hover:to-indigo-700
            shadow-lg hover:shadow-xl
            transform transition-all duration-300 ease-in-out
            hover:-translate-y-1 active:translate-y-0
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75
            disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed
          "
        >
          {loading ? 'Cargando...' : 'Filtrar'}
          {/* Opcional: Icono de filtro */}
          {!loading && (
            <svg className="inline-block w-4 h-4 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          )}
        </button>
      </div>
      {/* --- FIN DEL FILTRO DE FECHAS --- */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* 6. Actualizamos los títulos y los datos que mostramos */}
        <StatCard title="Códigos Generados (en rango)" value={stats?.generatedInRange} loading={loading} />
        <StatCard title="Premios Canjeados (en rango)" value={stats?.redeemedInRange} loading={loading} />
        <StatCard title="Total Códigos de Juego Sin Usar" value={stats?.unusedGameCodes} loading={loading} />
        <StatCard title="Total Premios Pendientes de Canje" value={stats?.pendingPrizes} loading={loading} />
      </div>
    </div>
  );
}