import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Curso, CursoVista } from '@/types/database';
//import { handleApiError } from '@/util/errorHandler';
import { getCursosByTipo, getCursosTipo } from '@/util/CursoService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Curso[]|CursoVista[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido',
    });
  }

  try {
    const { tipo } = req.query;

    // Si no se especifica un tipo, devolver todos los cursos agrupados por tipo
    if (tipo==='all') {
      const cursosPorTipo = await getCursosTipo();
      const cursos = Object.values(cursosPorTipo).flat(); // Convierte el objeto { [key: string]: CursoVista[] } en un arreglo plano CursoVista[]
      return res.status(200).json({
        success: true,
        message: 'Todos los cursos obtenidos correctamente',
        data: cursos,
      });
    }

    // Validar que el tipo sea válido
    if (tipo !== 'teoria' && tipo !== 'laboratorio') {
      return res.status(400).json({
        success: false,
        message: 'Tipo de curso no válido',
      });
    }

    // Si se especifica un tipo, devolver solo los cursos de ese tipo
    const cursos = await getCursosByTipo(tipo === 'teoria' ? 'TEORIA' : 'LABORATORIO');
    return res.status(200).json({
      success: true,
      message: `Cursos de ${tipo} obtenidos correctamente`,
      data: cursos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
