import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/util/db';
import { ApiResponse } from '@/types/database';
import { handleApiError } from '@/util/errorHandler';

interface TipoCurso {
  tipo: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TipoCurso[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido'
    });
  }

  try {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query<TipoCurso[]>('SELECT * FROM tipo_curso');
      
      res.status(200).json({
        success: true,
        message: 'Datos obtenidos correctamente',
        data: rows as TipoCurso[]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    handleApiError(error, res);
  }
}