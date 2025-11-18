// Ruta: /app/api/reports/redeemed-prizes/route.js

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import PrizeCode from '@/models/PrizeCode';
import User from '@/models/User'; // Importamos User para que .populate() funcione correctamente

export async function GET(req) {
  const session = await auth();
  // Ruta protegida solo para Admins
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  try {
    await dbConnect();

    // 1. Buscamos todos los códigos de premio que estén canjeados
    const redeemedPrizes = await PrizeCode.find({ isRedeemed: true })
      // 2. Usamos .populate() para traer los datos del cajero asociado
      //    - 'redeemedBy' es el campo en PrizeCode que guarda el ID del cajero.
      //    - 'email' es el único campo que queremos traer del documento del cajero.
      .populate('redeemedBy', 'email')
      // 3. Ordenamos por fecha de canje, del más reciente al más antiguo
      .sort({ redeemedAt: -1 });

    return NextResponse.json(redeemedPrizes, { status: 200 });

  } catch (error) {
    console.error("Error al generar el reporte de premios:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}