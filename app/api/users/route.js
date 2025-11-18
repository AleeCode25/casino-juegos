// Ruta: /app/api/users/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth'; // 👈 1. Importamos `auth` desde nuestro archivo central

export async function GET(req) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    try {
      // Busca todos los usuarios que NO son ADMIN y no devuelve su password
      const users = await User.find({ role: 'MODERATOR' }).select('-password');
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
  }

export async function POST(req) {
  // 2. Obtenemos la sesión de forma mucho más simple
  const session = await auth();

  // 3. Verificamos que el usuario sea ADMIN
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
  }

  try {
    await dbConnect();
    const { email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'El email ya está en uso.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      role: 'MODERATOR' // Por defecto se crea como moderador
    });

    await newUser.save();

    // No devuelvas la contraseña en la respuesta
    const userResponse = { id: newUser._id, email: newUser.email, role: newUser.role };

    return NextResponse.json({ message: 'Usuario creado con éxito', user: userResponse }, { status: 201 });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}