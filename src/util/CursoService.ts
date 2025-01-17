import { CursoVista, Curso } from '@/types/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '@/util/db';

// Interfaces para extender RowDataPacket
interface CursoRow extends Curso, RowDataPacket {}
interface CursoVistaRow extends CursoVista, RowDataPacket {}

type TipoCurso = 'TEORIA' | 'LABORATORIO';

export interface CursosAgrupados {
    [key: string]: CursoVista[];
}

export async function getCursosByTipo(tipo: TipoCurso): Promise<CursoVista[]> {
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.query<CursoVistaRow[]>(
      'SELECT * FROM v_cursos_completos WHERE tipo = ?',
      [tipo]
    );

    const filteredRows = rows.filter(row => 
      Array.isArray(row.grupos) && row.grupos[0] !== null
    );
    
    return filteredRows.map(row => ({
      id: row.id,
      nombre: row.nombre,
      tipo: row.tipo,
      color: row.color,
      grupos: row.grupos
    }));
  } finally {
    connection.release();
  }
}

export async function getCursosTipo(): Promise<{ [key: string]: CursoVista[] }> {
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.query<CursoVistaRow[]>(
      'SELECT * FROM v_cursos_completos'
    );

    return rows.reduce<{ [key: string]: CursoVista[] }>((acc, row) => {
      const curso = {
        id: row.id,
        nombre: row.nombre,
        tipo: row.tipo,
        color: row.color,
        grupos: row.grupos && row.grupos[0] !== null ? row.grupos : null
      };

      if (!acc[row.tipo]) {
        acc[row.tipo] = [];
      }
      acc[row.tipo].push(curso);
      return acc;
    }, {});
  } finally {
    connection.release();
  }
}

export async function getCursoById({id}: Partial<Curso>): Promise<Curso | null> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query<CursoRow[]>(
      'SELECT * FROM cursos WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

export async function createCurso({nombre, color, tipo}: Partial<Curso>): Promise<Curso | null> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO cursos (nombre, color, tipo) VALUES (?, ?, ?)',
      [nombre, color, tipo]
    );
    
    if (result.insertId) {
      const [rows] = await connection.query<CursoRow[]>(
        'SELECT * FROM cursos WHERE id = ?',
        [result.insertId]
      );
      return rows[0] || null;
    }
    return null;
  } finally {
    connection.release();
  }
}

export async function deleteCurso({id}: Partial<Curso>): Promise<boolean> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM cursos WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

export async function updateCurso({id, nombre, color}: Partial<Curso>): Promise<Curso | null> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      'UPDATE cursos SET nombre = ?, color = ? WHERE id = ?',
      [nombre, color, id]
    );
    
    if (result.affectedRows > 0) {
      const [rows] = await connection.query<CursoRow[]>(
        'SELECT id, nombre, color, tipo FROM cursos WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    }
    return null;
  } finally {
    connection.release();
  }
}