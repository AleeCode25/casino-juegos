// Ruta: /app/api/play/[slug]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Game from '@/models/Game';
import PrizeCode from '@/models/PrizeCode';
import { randomUUID } from 'crypto';

const generatePrizeCode = () => {
    const rawUUID = randomUUID();
    const shortCode = `P-${rawUUID.substring(0, 8).toUpperCase()}`;
    return shortCode;
}

async function getDynamicPrize(gameSlug) {
  await dbConnect();
  const game = await Game.findOne({ slug: gameSlug });

  if (!game || !game.prizes || game.prizes.length === 0) {
    return null;
  }

  const availablePrizes = game.prizes.filter(prize => prize.stock !== 0);
  if (availablePrizes.length === 0) {
      return null;
  }
  
  const totalWinPercentage = availablePrizes.reduce((sum, prize) => sum + prize.probability, 0);
  const roll = Math.random() * 100;

  if (roll > totalWinPercentage) {
    return null;
  }

  let cumulativeProbability = 0;
  for (const prize of availablePrizes) {
    cumulativeProbability += prize.probability;
    if (roll <= cumulativeProbability) {
      if (prize.stock !== -1) {
        await Game.updateOne(
          { _id: game._id, "prizes._id": prize._id },
          { $inc: { "prizes.$.stock": -1 } }
        );
      }
      return { name: prize.name };
    }
  }
  return null;
}

// --- INICIO DE LA CORRECCIÓN ---
// 1. Cambiamos la firma de la función a solo (req)
export async function POST(req) {
  
  // 2. Obtenemos el 'slug' manualmente desde la URL
  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop(); // Extrae 'raspadita-magica' de la URL
  // --- FIN DE LA CORRECCIÓN ---

  const { playerUsername } = await req.json();

  if (!playerUsername) {
    return NextResponse.json({ message: "Nombre de usuario no proporcionado." }, { status: 400 });
  }

  const prize = await getDynamicPrize(slug);

  if (!prize) {
    return NextResponse.json({ result: "no-win", message: "Mejor suerte la próxima vez" });
  }

  try {
    await dbConnect();
    const newPrizeCode = new PrizeCode({
        code: generatePrizeCode(),
        prizeDetails: prize.name,
        awardedToUser: playerUsername
    });
    await newPrizeCode.save();

    return NextResponse.json({
        result: "win",
        message: `¡Felicidades, ${playerUsername}!`,
        prize: prize.name,
        prizeCode: newPrizeCode.code,
    });

  } catch (error) {
    return NextResponse.json({ message: "Error al guardar el premio" }, { status: 500 });
  }
}