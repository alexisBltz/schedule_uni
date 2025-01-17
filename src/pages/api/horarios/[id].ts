import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Horario } from '@/types/database';
//import { handleApiError } from '@/util/errorHandler';
import { /*createHorario, updateHorario,*/ deleteHorario, getHorarioById } from '@/util/HorarioService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Horario | Horario[]>> 
) {

  const { id } = req.query;
  if (!id && req.method !== 'GET') {
    return res.status(400).json({
      success: false,
      message: 'ID es requerido para este tipo de petición',
    });
  }

  
  switch (req.method) {


    case 'GET':
      try {
        const Horario = await getHorarioById(Number(id));
        if (!Horario && id) {
          return res.status(404).json({
            success: false,
            message: 'Horario no encontrado',
          });
        }
        res.status(200).json({
          success: true,
          message: 'Horario obtenido correctamente',
          data: Horario,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Error del servidor',
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
      break;


    // Eliminar un Horario (DELETE)
    case 'DELETE':
        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'ID de Horario requerido para eliminar',
          });
        }
  
        try {
          await deleteHorario(Number(id));
          res.status(200).json({
            success: true,
            message: 'Horario eliminado correctamente',
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
          });
        }
        break;

    // Crear un nuevo Horario (POST)
    /*case 'POST':
      const { nombre, color, tipo } = req.body;
      if (!nombre || !color || !tipo) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos para crear el Horario',
        });
      }

      try {
        const Horario = await createHorario({ nombre, color, tipo });
        res.status(201).json({
          success: true,
          message: 'Horario creado correctamente',
          data: Horario,
        });
      } catch (error) {
        handleApiError(error, res);
      }
      break;
      */


    // Actualizar un Horario existente (PUT)
    /*case 'PUT':
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de Horario requerido para actualizar',
        });
      }

      const { nombre: newNombre, color: newColor, tipo: newTipo } = req.body;

      if (!newNombre || !newColor || !newTipo) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos para actualizar el Horario',
        });
      }

      try {
        const Horario = await updateHorario(Number(id), { nombre: newNombre, color: newColor, tipo: newTipo });
        res.status(200).json({
          success: true,
          message: 'Horario actualizado correctamente',
          data: Horario,
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
