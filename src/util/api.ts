import { CourseData, Course, Group } from '@/types/course';
import { ApiResponse } from '@/types/database';

const TIMEOUT = 10000;

export const getCourses = async (): Promise<CourseData> => {
    return fetchWithTimeout('/api/cursos/tipo/all');
};

export const getCoursesByType = async (tipo: string): Promise<Course[]> => {
    return tipo === "teoria" ? fetchWithTimeout('/api/cursos/tipo/teoria') 
            : tipo === "laboratorio" ? fetchWithTimeout('/api/cursos/tipo/laboratorio')
            : [];
}


// CRUD de cursos

/**
 * Método de apoyo para formatear el nombre.
 * Capitaliza palabras mayores a 3 caracteres y mantiene en minúscula las demás.
 */
export const formatName = (name: string): string => {
    return name
        .split(' ')
        .map(word =>
            word.length > 2
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word.toLowerCase()
        )
        .join(' ');
};

export const createCourse = async ({ nombre, color, tipo }: Partial<Course>): Promise<Course> => {
    const formattedNombre = nombre ? formatName(nombre) : nombre;

    return fetchWithTimeout('/api/cursos/0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: formattedNombre, color, tipo }),
    });
};
export const updateCourse = async ({id, nombre, color, tipo}: Partial<Course>): Promise<Course> => {
    const formattedNombre = nombre ? formatName(nombre) : nombre;
    return fetchWithTimeout(`/api/cursos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({nombre: formattedNombre, color, tipo}),
    });
}
export const deleteCourse = async ({id}: Partial<Course>): Promise<void> => {
    return fetchWithTimeout(`/api/cursos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
}
export const getCourseById = async (id: number): Promise<Course> => {
    return fetchWithTimeout(`/api/cursos/${id}`);
}



// CRUD de grupos

export const deleteGroup = async ({id}: Partial<Group>): Promise<void> => {
    return fetchWithTimeout(`/api/grupos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
}
export const createGroupSchedules = async ({grupo, curso_id, horarios}: Partial<Group>): Promise<Group> => {
    return fetchWithTimeout('/api/grupos/0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({grupo, curso_id, horarios}),
    });
}


const fetchWithTimeout = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const body: ApiResponse<T> = await response.json();
        return body.data as T;
        
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
        clearTimeout(timeoutId);
    }
};