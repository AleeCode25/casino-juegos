// Ruta: /app/api/games/[id]/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Game from '@/models/Game';

// --- ¡FUNCIÓN GET CORREGIDA! ---
export async function GET(req) { // 1. Firma simplificada (solo req)
  
  // 2. Obtenemos el slug manualmente desde la URL
  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop();

  if (!slug) {
    return NextResponse.json({ message: 'Slug no proporcionado' }, { status: 400 });
  }

  try {
    await dbConnect();
    // 3. Buscamos por 'slug' (como ya lo hacía)
    const game = await Game.findOne({ slug: slug });

    if (!game) {
      return NextResponse.json({ message: 'Juego no encontrado' }, { status: 404 });
    }

    return NextResponse.json(game, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// --- FUNCIÓN PATCH (Ya estaba corregida) ---
export async function PATCH(req) {
  const session = await auth();
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  const { isActive } = await req.json();
  const canManage = session?.user?.role === 'ADMIN' || session?.user?.canManageGames === true;

  if (!canManage) {
    return NextResponse.json({ message: 'Acceso prohibido' }, { status: 403 });
  }
  try {
    await dbConnect();
    const updatedGame = await Game.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!updatedGame) {
      return NextResponse.json({ message: 'Juego no encontrado' }, { status: 404 });
    }
    return NextResponse.json(updatedGame, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// --- FUNCIÓN PUT (Ya estaba corregida) ---
export async function PUT(req) {
  const session = await auth();
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acceso prohibido' }, { status: 403 });
  }
  try {
    const { name, description, prizes } = await req.json();
    await dbConnect();
    const updatedGame = await Game.findByIdAndUpdate(
      id,
      { name, description, prizes },
      { new: true, runValidators: true }
    );
    if (!updatedGame) {
      return NextResponse.json({ message: 'Juego no encontrado' }, { status: 404 });
    }
    return NextResponse.json(updatedGame, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}