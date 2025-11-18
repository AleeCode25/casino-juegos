// Ruta: /app/login/page.jsx
"use client";

import { useState, Suspense } from "react"; // 1. Importamos Suspense
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// 2. Creamos un componente interno SOLO para el formulario
// Este componente es el que usa useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Credenciales inválidas. Intenta de nuevo.");
        setLoading(false);
      } else if (res?.ok) {
        // Forzamos una recarga completa para actualizar la sesión y los permisos
        window.location.href = callbackUrl; 
      }
    } catch (error) {
       setError("Ocurrió un error inesperado.");
       setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Panel de Control</h1>
        <h2 className="text-sm text-center text-gray-500">Inicio de Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
           <input 
             type="email" 
             value={email} 
             onChange={e => setEmail(e.target.value)} 
             placeholder="Email" 
             required 
             className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
           />
           <input 
             type="password" 
             value={password} 
             onChange={e => setPassword(e.target.value)} 
             placeholder="Contraseña" 
             required 
             className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
           />
           <button 
             type="submit" 
             disabled={loading} 
             className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
           >
             {loading ? 'Ingresando...' : 'Entrar'}
           </button>
           {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </form>
      </div>
  );
}

// 3. El componente principal exportado envuelve al formulario en Suspense
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<div className="text-gray-600">Cargando panel de acceso...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}