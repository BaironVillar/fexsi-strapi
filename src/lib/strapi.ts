const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

interface Project {
  id: number;
  attributes: {
    title: string;
    description: {
      type: string;
      children: {
        type: string;
        text: string;
      }[];
    }[];
    category: string;
    client: string;
    year: string;
    services: string;
    featured: boolean;
    image: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    };
  };
}

export async function getProjects() {
  try {
    const res = await fetch(`${import.meta.env.STRAPI_URL}/api/projects`);
    if (!res.ok) {
      console.error('Error fetching projects:', res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/projects?filters[featured][$eq]=true&populate=*`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    const response = await fetch(
      `${import.meta.env.PUBLIC_STRAPI_URL}/api/categories?populate=*`,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.PUBLIC_STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching categories');
    }

    const responseText = await response.text();
    console.log('Respuesta raw de categorías:', responseText); // Para depuración

    const { data } = JSON.parse(responseText);
    return data || [];

  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function getServices() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/services`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function createProject(formData: FormData) {
  try {
    // Primero subimos la imagen
    const imageFile = formData.get('image') as File;
    const imageFormData = new FormData();
    imageFormData.append('files', imageFile);

    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: imageFormData
    });

    if (!uploadResponse.ok) {
      throw new Error('Error al subir la imagen');
    }

    const uploadedImage = await uploadResponse.json();

    // Luego creamos el proyecto
    const projectData = {
      data: {
        title: formData.get('title'),
        description: formData.get('description'),
        service: formData.get('service'),
        image: uploadedImage[0].id
      }
    };

    const response = await fetch(`${STRAPI_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      throw new Error('Error al crear el proyecto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createProject:', error);
    throw error;
  }
} 