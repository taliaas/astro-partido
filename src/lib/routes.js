// config/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { auth } from './auth'; // Importa tu instancia de autenticación

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    // Verificar si el usuario está autenticado
    const isAuthenticated = await auth.isAuthenticated(context.request);
    
    if (!isAuthenticated && context.url.pathname.startsWith('/protected')) {
      // Redirigir al usuario para iniciar sesión si no está autenticado
      return auth.redirectToSignIn();
    }
    
    // Proceder con la solicitud si está autenticado
    return next();
  } catch (error) {
    console.error('Error de autorización:', error);
    // Manejar el error según sea necesario
    return next();
  }
});
