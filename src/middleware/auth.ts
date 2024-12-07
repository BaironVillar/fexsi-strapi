import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/admin')) {
    const token = context.cookies.get('auth-token')?.value;
    
    if (!token && context.url.pathname !== '/admin/login') {
      return context.redirect('/admin/login');
    }
  }
  
  return next();
}); 