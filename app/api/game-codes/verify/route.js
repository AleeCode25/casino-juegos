// Ruta: /app/api/game-codes/verify/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GameCode from '@/models/GameCode';

// 1. Define tu código maestro aquí. ¡Que sea fácil de recordar!
const MASTER_CODE = "FORTUNA777VIP";

export async function POST(req) {
  try {
    const { code, username } = await req.json();

    if (!code || !username) {
      return NextResponse.json({ message: 'El código y el nombre de usuario son requeridos.' }, { status: 400 });
    }

    // --- ¡AQUÍ ESTÁ LA MAGIA! ---
    // 2. Verificamos si el código ingresado es el Código Maestro
    if (code.toUpperCase() === MASTER_CODE) {
      console.log(`Acceso concedido con Código Maestro para el usuario: ${username}`);
      
      // No tocamos la base de datos.
      // Simplemente respondemos con éxito para que el frontend te deje pasar.
      // El frontend (ingresar/page.jsx) se encargará de guardar el username
      // en sessionStorage como siempre.
      return NextResponse.json({ message: '¡Código Maestro activado!' }, { status: 200 });
    }
    // --- FIN DE LA MAGIA ---

    // 3. Si no es el código maestro, sigue el flujo normal
    await dbConnect();
    const gameCode = await GameCode.findOne({
      code: code,
      isRedeemed: false // Busca uno que no esté usado
    });

    if (!gameCode) {
      return NextResponse.json({ message: 'Código inválido o ya fue canjeado.' }, { status: 404 });
    }

    // 4. Si es un código normal, lo marcamos como usado
    gameCode.isRedeemed = true;
    gameCode.redeemedAt = new Date();
    gameCode.playerUsername = username;
    await gameCode.save();

    return NextResponse.json({ message: '¡Código canjeado con éxito! Bienvenido.' }, { status: 200 });

  } catch (error) {
    console.error("Error al verificar código:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}