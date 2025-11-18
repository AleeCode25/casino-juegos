// Ruta: /middleware.js

import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; // 👈 Asegúrate que importe de auth.config.js

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};