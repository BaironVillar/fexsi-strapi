import type { APIRoute } from 'astro';

const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Credenciales inválidas' 
        }), 
        { status: 401 }
      );
    }

    // Crear cookie con el token
    return new Response(
      JSON.stringify({ success: true }), 
      {
        status: 200,
        headers: {
          'Set-Cookie': `auth-token=${data.jwt}; Path=/; HttpOnly; Secure; SameSite=Strict`
        }
      }
    );

  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ error: 'Error al iniciar sesión' }), 
      { status: 500 }
    );
  }
}; 