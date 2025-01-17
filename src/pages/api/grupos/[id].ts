import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Grupo } from '@/types/database';
import { handleApiError } from '@/util/errorHandler';
import { createGrupoSchedules, /* updateGrupo, */ deleteGrupo, getGrupoById } from '@/util/GrupoService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Grupo | Grupo[]>> 
) {

  const grupoId = req.query.id ? Number(req.query.id) : null;

  switch (req.method) {

    case 'GET': {
      if (grupoId) {
        const curso = await getGrupoById({ id: grupoId });
        return res.status(curso ? 200 : 404).json({
          success: Boolean(curso),
          message: curso ? 'Curso obtenido correctamente' : 'Curso no encontrado',
          data: curso || null,
        });
      }
    }

    // Eliminar un Grupo (DELETE)
    case 'DELETE': {
        if (!grupoId) {
          return res.status(400).json({
            success: false,
            message: 'ID es requerido',
          });
        }

        await deleteGrupo({ id: grupoId });
        return res.status(200).json({
          success: true,
          message: 'Grupo eliminado correctamente',
          data: null,
        });
      }

    case 'POST': {
        const { grupo, curso_id, horarios } = req.body;

        if (!grupo && !curso_id && !horarios) {
          return res.status(400).json({
            success: false,
            message: 'Datos incompletos o inválidos',
          });
        }

        const newCurso = await createGrupoSchedules({ grupo, curso_id, horarios });
        return res.status(201).json({
          success: true,
          message: 'Curso creado correctamente',
          data: newCurso,
        });
      }

    // Crear un nuevo Grupo (POST)
    /*case 'POST':
      const { nombre, color, tipo } = req.body;
      if (!nombre || !color || !tipo) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos para crear el Grupo',
        });
      }

      try {
        const Grupo = await createGrupo({ nombre, color, tipo });
        res.status(201).json({
          success: true,
          message: 'Grupo creado correctamente',
          data: Grupo,
        });
      } catch (error) {
        handleApiError(error, res);
      }
      break;
      */

    // Actualizar un Grupo existente (PUT)
    /*case 'PUT':
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de Grupo requerido para actualizar',
        });
      }

      const { nombre: newNombre, color: newColor, tipo: newTipo } = req.body;

      if (!newNombre || !newColor || !newTipo) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos para actualizar el Grupo',
        });
      }

      try {
        const Grupo = await updateGrupo(Number(id), { nombre: newNombre, color: newColor, tipo: newTipo });
        res.status(200).json({
          success: true,
          message: 'Grupo actualizado correctamente',
          data: Grupo,
        });
      } catch (error) {
        handleApiError(error, res);
      }
      break;

      */

    


    default:
      res.status(405).json({
        success: false,
        message: 'Método no permitido',
      });
      break;
  }
}
