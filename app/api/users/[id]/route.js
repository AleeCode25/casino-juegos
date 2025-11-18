// Ruta: /app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// --- FUNCIÓN DELETE (Eliminar Cajero) ---
export async function DELETE(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }
  
  try {
    await dbConnect();
    const { id } = params;
    
    // No permitas que un admin se borre a sí mismo por accidente
    if (session.user.id === id) {
        return NextResponse.json({ message: 'No puedes eliminarte a ti mismo' }, { status: 400 });
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Usuario eliminado con éxito' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// --- FUNCIÓN PUT (Editar Cajero, ej: Resetear Contraseña) ---
export async function PUT(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }
  
  try {
    await dbConnect();
    const { id } = params;
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    return NextResponse.json({ message: 'Contraseña del usuario actualizada' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}