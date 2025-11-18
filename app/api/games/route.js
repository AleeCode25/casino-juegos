// Ruta: /app/api/games/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Game from '@/models/Game';

export async function GET(req) {
  const session = await auth();
  // Solo usuarios logueados pueden ver la lista
  if (!session) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    await dbConnect();
    const games = await Game.find({}); // Obtiene todos los juegos
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}