// Ruta: /app/components/RedeemedPrizesReport.jsx
"use client";

import { useState, useEffect } from 'react';

export default function RedeemedPrizesReport() {
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch('/api/reports/redeemed-prizes');
        if (!res.ok) throw new Error('No se pudo cargar el reporte');
        const data = await res.json();
        setPrizes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <p className="text-center">Cargando reporte...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-2 xl:col-span-3">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Premios Canjeados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Premio</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jugador</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Canjeado por (Cajero)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prizes.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-sm text-gray-500 text-center">No hay premios canjeados aún.</td>
              </tr>
            ) : (
              prizes.map((prize) => (
                <tr key={prize._id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{prize.prizeDetails}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{prize.awardedToUser}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-semibold">
                    {/* Aquí mostramos el email del cajero que obtuvimos con .populate() */}
                    {prize.redeemedBy?.email || 'Dato no disponible'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(prize.redeemedAt).toLocaleString('es-AR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}