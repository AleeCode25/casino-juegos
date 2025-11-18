// Ruta: /app/api/reports/generated-codes/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import GameCode from '@/models/GameCode';
import User from '@/models/User'; // Necesario para .populate

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  try {
    await dbConnect();
    const codes = await GameCode.find({})
      .populate('generatedBy', 'email') // Trae el email del cajero
      .sort({ createdAt: -1 }) // Más recientes primero
      .limit(100); // Límite de 100 para no sobrecargar

    return NextResponse.json(codes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}