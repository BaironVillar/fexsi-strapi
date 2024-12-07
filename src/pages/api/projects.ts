import type { APIRoute } from 'astro';
import { createProject } from '../../lib/strapi';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const result = await createProject(formData);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error en POST /api/projects:', error);
    return new Response(JSON.stringify({ error: 'Error al crear el proyecto' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 