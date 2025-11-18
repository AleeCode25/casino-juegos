// Ruta: /auth.config.js

export const authConfig = {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isPanelRoute = nextUrl.pathname.startsWith('/panel'); // Rutas protegidas
  
        if (isPanelRoute) {
          if (isLoggedIn) return true; // Permitir si está logueado
          return false; // Redirigir a /login si no lo está
        } else if (isLoggedIn) {
          // Si ya está logueado y va a /login, redirigir al panel
          return Response.redirect(new URL('/panel', nextUrl));
        }
        return true; // Permitir acceso a otras rutas (como /login)
      },
    },
    providers: [], // Los proveedores se definirán en el archivo principal
  };