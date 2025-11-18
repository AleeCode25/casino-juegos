// Ruta: /app/api/prize-codes/redeem/route.js

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import PrizeCode from '@/models/PrizeCode';

export async function POST(req) {
  // 1. Proteger la ruta
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ message: 'El código es requerido' }, { status: 400 });
    }

    await dbConnect();

    // 2. Buscar un código que exista Y que no haya sido canjeado
    const prizeCode = await PrizeCode.findOne({
      code: code.trim(),
      isRedeemed: false,
    });

    if (!prizeCode) {
      return NextResponse.json({ message: 'Código inválido o ya fue canjeado' }, { status: 404 });
    }

    // 3. Marcar el código como canjeado
    prizeCode.isRedeemed = true;
    prizeCode.redeemedAt = new Date();
    prizeCode.redeemedBy = session.user.id; // Guardamos quién lo canjeó
    await prizeCode.save();

    // 4. Devolver los detalles del premio
    return NextResponse.json({
      message: 'Premio canjeado con éxito',
      prizeDetails: prizeCode.prizeDetails,
      awardedToUser: prizeCode.awardedToUser,
    }, { status: 200 });

  } catch (error) {
    console.error("Error al canjear código de premio:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}