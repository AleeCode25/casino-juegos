import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirige directamente al login de jugador
  redirect('/ingresar');
}