// Ruta: /app/api/stats/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import GameCode from '@/models/GameCode';
import PrizeCode from '@/models/PrizeCode';

export async function GET(req) { // Necesitamos 'req' para leer la URL
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  try {
    await dbConnect();

    // 1. Leer los parámetros 'from' y 'to' de la URL
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let startDate, endDate;

    if (from && to) {
      // Si se provee un rango, lo usamos
      startDate = new Date(from);
      startDate.setHours(0, 0, 0, 0); // Inicio del día 'from'

      endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999); // Fin del día 'to'
    } else {
      // Por defecto (si no hay rango), usamos "hoy"
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    // 2. Crear los filtros de fecha para Mongoose
    const dateFilterGenerated = { createdAt: { $gte: startDate, $lte: endDate } };
    const dateFilterRedeemed = { redeemedAt: { $gte: startDate, $lte: endDate } };

    // 3. Contar códigos generados USANDO EL FILTRO
    const generatedInRange = await GameCode.countDocuments(dateFilterGenerated);

    // 4. Contar premios canjeados USANDO EL FILTRO
    const redeemedInRange = await PrizeCode.countDocuments(dateFilterRedeemed);

    // 5. Las otras estadísticas son totales, no necesitan filtro de fecha
    const pendingPrizes = await PrizeCode.countDocuments({ isRedeemed: false });
    const unusedGameCodes = await GameCode.countDocuments({ isRedeemed: false });

    return NextResponse.json({
      generatedInRange,
      redeemedInRange,
      pendingPrizes,
      unusedGameCodes
    }, { status: 200 });

  } catch (error) {
    console.error("Error en API de stats:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}