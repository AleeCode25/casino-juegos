// Ruta: /app/api/games/seed/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Game from '@/models/Game';

const gamesData = [
  { name: "Tragamonedas de la Fortuna", slug: "tragamonedas-fortuna", description: "Un clásico de 3 rodillos." },
  { name: "La Rueda de los Premios", slug: "rueda-premios", description: "Gira la rueda y prueba tu suerte." },
  // Reemplazamos 'Cofres del Tesoro' por 'La Llave Maestra'
  { name: "La Llave Maestra", slug: "llave-maestra", description: "Elige la llave correcta." },
  { name: "Cascada de la Suerte", slug: "cascada-suerte", description: "Suelta la ficha y mira dónde cae." },
  { name: "Raspadita Mágica", slug: "raspadita-magica", description: "Raspa y descubre si ganaste al instante." },
  { name: "Carrera de Cocodrilos", slug: "carrera-cocodrilos", description: "Elige un cocodrilo y que gane el mejor." },
  // --- ¡NUEVO JUEGO AÑADIDO! ---
  { name: "Pares Ganadores", slug: "pares-ganadores", description: "Encuentra 3 cartas iguales para ganar." },
];

export async function GET() {
  await dbConnect();

  try {
    // Para evitar duplicados, borramos y re-insertamos la lista completa
    await Game.deleteMany({}); 
    await Game.insertMany(gamesData);

    return NextResponse.json({ message: 'Base de datos de juegos sembrada con éxito.' });
  } catch (error) {
    return NextResponse.json({ message: 'Error al sembrar la base de datos.', error: error.message }, { status: 500 });
  }
}