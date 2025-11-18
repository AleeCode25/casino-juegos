// Ruta: /app/(panel)/layout.jsx

import { auth } from "@/auth"; // <-- Usamos la nueva forma de v5
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";

export default async function PanelLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Esta variable decide si se muestra el link o no
  const isAdmin = session.user.role === 'ADMIN';

  return (
    <section className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
            <h1 className="font-bold text-xl">Panel de Control</h1>
            <Link href="/" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
            
            {/* 👇 Este enlace solo se renderizará si isAdmin es true */}
            {isAdmin && (
              <Link href="panel/admin" className="font-semibold text-purple-600 hover:text-purple-800">
                Admin
              </Link>
            )}
        </div>
        <div className="flex items-center gap-4">
          <p>{session.user.email} <span className="text-sm text-gray-500">({session.user.role})</span></p>
          <LogoutButton />
        </div>
      </nav>
      <main className="p-8">{children}</main>
    </section>
  );
}