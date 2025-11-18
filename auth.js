// Ruta: /auth.js

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const { 
  handlers: { GET, POST }, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        try {
          await dbConnect();
          const user = await User.findOne({ email });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            // 👇 ESPÍA #1: ¿QUÉ ESTAMOS DEVOLVIENDO?
            console.log("✅ AUTORIZADO CORRECTAMENTE, DEVOLVIENDO USUARIO:", user);
            return user;
          }
          
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // 👇 ESPÍA #2: ¿QUÉ ESTAMOS RECIBIENDO?
      console.log("CALLBACK JWT RECIBIENDO USUARIO:", user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.canManageGames = user.canManageGames; // Asegúrate de que este campo exista en tu modelo User
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.canManageGames = token.canManageGames;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});