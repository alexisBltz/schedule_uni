import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Curso } from '@/types/database';
import { handleApiError } from '@/util/errorHandler';
import { createCurso, updateCurso, deleteCurso, getCursoById } from '@/util/CursoService';

const validateCursoData = (data: Partial<Curso>): boolean => {
  const { nombre, color, tipo } = data;
  return Boolean(nombre && color && tipo);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Curso | null>>
) {
  const cursoId = req.query.id ? Number(req.query.id) : null;

  try {
    switch (req.method) {
      case 'GET': {
        if (cursoId) {
          const curso = await getCursoById({ id: cursoId });
          return res.status(curso ? 200 : 404).json({
            success: Boolean(curso),
            message: curso ? 'Curso obtenido correctamente' : 'Curso no encontrado',
            data: curso || null,
          });
        }
      }

      case 'POST': {
        const { nombre, color, tipo } = req.body;

        if (!validateCursoData({ nombre, color, tipo })) {
          return res.status(400).json({
            success: false,
            message: 'Datos incompletos o inválidos',
          });
        }

        const newCurso = await createCurso({ nombre, color, tipo });
        return res.status(201).json({
          success: true,
          message: 'Curso creado correctamente',
          data: newCurso,
        });
      }

      case 'PUT': {
        const { nombre, color, tipo } = req.body;

        if (!cursoId || !validateCursoData({ nombre, color, tipo })) {
          return res.status(400).json({
            success: false,
            message: 'ID y datos del curso son requeridos',
          });
        }

        const updatedCurso = await updateCurso({ id: cursoId, nombre, color });
        return res.status(200).json({
          success: true,
          message: 'Curso actualizado correctamente',
          data: updatedCurso,
        });
      }

      case 'DELETE': {
        if (!cursoId) {
          return res.status(400).json({
            success: false,
            message: 'ID es requerido',
          });
        }

        await deleteCurso({ id: cursoId });
        return res.status(200).json({
          success: true,
          message: 'Curso eliminado correctamente',
          data: null,
        });
      }

      default:
        return res.status(405).json({
          success: false,
          message: 'Método no permitido',
        });
    }
  } catch (error) {
    handleApiError(error, res);
  }
}
