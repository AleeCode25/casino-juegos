// Ruta: /app/components/GeneratedCodesReport.jsx
"use client";
import { useState, useEffect } from 'react';

export default function GeneratedCodesReport() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/generated-codes')
      .then(res => res.json())
      .then(data => {
        setCodes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando reporte de códigos...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-3">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Códigos de Juego Generados</h2>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Generado por</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {codes.map(code => (
              <tr key={code._id}>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">{code.code}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{code.generatedBy?.email || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(code.createdAt).toLocaleString('es-AR')}</td>
                <td className="px-4 py-3 text-sm">
                  {code.isRedeemed ? (
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Usado</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Pendiente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}