import dbConnect from '@/lib/db';
import Game from '@/models/Game';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();
        const activeGames = await Game.find({ isActive: true });
        return NextResponse.json(activeGames, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
    }
}