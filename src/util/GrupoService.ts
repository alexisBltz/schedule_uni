
import { Grupo } from '@/types/database';
import pool from '@/util/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Interfaces para extender RowDataPacket
interface GrupoRow extends Grupo, RowDataPacket {}

//metodo para obtener un grupo
export async function getGrupoById({id}: Partial<Grupo>): Promise<Grupo> {
  const connection = await pool.getConnection();
  try {
    const [grupo] = await connection.query<GrupoRow[]>('SELECT * FROM grupos WHERE id = ?', [id]);
    return grupo[0];
  } finally {
    connection.release();
  }
}

// metodo para eliminar un grupo
export async function deleteGrupo(id: number): Promise<boolean> {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM grupos WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}

export async function createGrupoSchedules(
  { grupo, curso_id, horarios }: Partial<Grupo>
): Promise<Grupo> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();  // Iniciar transacción

    const [resultGrupo] = await connection.query<ResultSetHeader>(     // Insertar el grupo
      'INSERT INTO grupos (curso_id, grupo) VALUES (?, ?)',
      [curso_id, grupo]
    );
    const grupoId = resultGrupo.insertId;

    if (horarios && horarios.length > 0) {        // Insertar los horarios asociados al grupo
      const horarioValues = horarios.map(horario => [
        grupoId,
        horario.dia,
        horario.hora_ini,
        horario.hora_fin
      ]);

      await connection.query(
        'INSERT INTO horarios (grupo_id, dia, hora_ini, hora_fin) VALUES ?',
        [horarioValues]
      );
    }

    // Obtener el grupo completo con sus horarios
    const [grupoNew] = await connection.query<GrupoRow[]>(`
      SELECT g.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', h.id,
            'dia', h.dia,
            'hora_ini', h.hora_ini,
            'hora_fin', h.hora_fin
          )
        ) as horarios
      FROM grupos g
      LEFT JOIN horarios h ON g.id = h.grupo_id
      WHERE g.id = ?
      GROUP BY g.id
    `, [grupoId]);

    await connection.commit();    // Confirmar transacción
    return grupoNew[0];

  } catch (error) {
    await connection.rollback();      // Revertir cambios si hay error
    throw error;
  } finally {
    connection.release();
  }
}




// metodo para crear un curso
/*export async function createCurso(nombre: string, color: string, tipo: TipoCurso): Promise<Curso> {
  const connection = await pool.getConnection();
  try {
    await connection.query('INSERT INTO cursos (nombre, color, tipo) VALUES (?, ?, ?)', [nombre, color, tipo]);
    const [curso] = await connection.query<Curso>('SELECT * FROM grupos WHERE id = LAST_INSERT_ID()');
    return curso[0];
  } finally {
    connection.release();
  }
}*/

// metodo actualizar un curso
/*export async function updateCurso(id: number, nombre: string, color: string, tipo: TipoCurso): Promise<Curso> {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE cursos SET nombre = ?, color = ?, tipo = ? WHERE id = ?', [nombre, color, tipo, id]);
    const [curso] = await connection.query<Curso>('SELECT FROM grupos WHERE id = ?', [id]);
    return curso[0];
  } finally {
    connection.release();
  }
}*/


