// Ruta: /app/api/game-codes/route.js

import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Importamos la sesión desde nuestro auth.js
import dbConnect from '@/lib/db';
import GameCode from '@/models/GameCode';
import { randomUUID } from 'crypto'; // Para generar códigos únicos

export async function POST(req) {
  // 1. Proteger la ruta: Asegurarse de que el usuario haya iniciado sesión
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    await dbConnect();

    // 2. Generar un código único y más legible
    const rawUUID = randomUUID();
    const shortCode = rawUUID.substring(0, 13).toUpperCase().replace(/-/g, ''); // Ej: 5E8A2F1B8C9D
    const formattedCode = `${shortCode.slice(0, 4)}-${shortCode.slice(4, 8)}-${shortCode.slice(8)}`; // Ej: 5E8A-2F1B-8C9D

    // 3. Crear el nuevo código en la base de datos
    const newGameCode = new GameCode({
      code: formattedCode,
      generatedBy: session.user.id, // Guardamos quién lo generó
    });

    await newGameCode.save();

    // 4. Devolver el código generado
    return NextResponse.json({ code: newGameCode.code }, { status: 201 });

  } catch (error) {
    console.error("Error al generar código de juego:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}