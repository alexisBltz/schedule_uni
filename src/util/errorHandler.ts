import { NextApiResponse } from 'next';
import { ApiResponse } from '@/types/database';

export const handleApiError = (error: unknown, res: NextApiResponse<ApiResponse<unknown>>) => {
  console.error('Error:', error);

  // Error de base de datos
  if (error instanceof Error && error.message.toLowerCase().includes('database')) {
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: error.message
    });
  }

  // Error de validación
  if (error instanceof Error && error.message.toLowerCase().includes('validation')) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      error: error.message
    });
  }

  // Error genérico
  return res.status(500).json({
    success: false,
    message: 'Error del servidor',
    error: error instanceof Error ? error.message : 'Error desconocido'
  });
};