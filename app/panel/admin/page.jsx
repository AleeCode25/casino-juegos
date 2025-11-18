// Ruta: /app/(panel)/admin/page.jsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CreateUserForm from '../../components/CreateUserForm';
import GameEditor from '../../components/GameEditor';
import ManagePermissions from '../../components/ManagePermissions';
import RedeemedPrizesReport from '../../components/RedeemedPrizesReport';
import GeneratedCodesReport from '../../components/GeneratedCodesReport'; // <-- Nuevo

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
      <p className="text-gray-600 mt-2">Gestión avanzada del sistema.</p>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <CreateUserForm />
        <ManagePermissions />
        <GameEditor />
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RedeemedPrizesReport />
        <GeneratedCodesReport />
      </div>
    </div>
  );
}