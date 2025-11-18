// Ruta: /app/(panel)/page.jsx

import { auth } from "@/auth";
import AdminDashboard from "../components/AdminDashboard"; // El Centro de Mando
import GenerateGameCode from "../components/GenerateGameCode"; // Herramienta de Cajero 1
import RedeemPrizeCode from "../components/RedeemPrizeCode"; // Herramienta de Cajero 2
import ManageGames from "../components/ManageGames"; // Herramienta de Cajero 3 (el toggle rápido)

export default async function PanelDashboard() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';
  const userCanManageGames = session?.user?.canManageGames === true;

  return (
    <div>
      {/* 1. Si el usuario es ADMIN, muestra el Centro de Mando primero */}
      {isAdmin && (
        <>
          <AdminDashboard />
          <hr className="my-10 border-gray-300" />
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Herramientas Rápidas</h2>
        </>
      )}

      {/* 2. Muestra las herramientas de cajero para TODOS (Cajeros y Admins) */}
      {/* Los cajeros normales solo verán esta sección. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GenerateGameCode />
        <RedeemPrizeCode />
        
        {/* 3. Muestra el toggle de juegos si es Admin O si es un cajero con permiso */}
        {(isAdmin || userCanManageGames) && <ManageGames />}
      </div>
    </div>
  );
}