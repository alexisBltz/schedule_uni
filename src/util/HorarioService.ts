
import { Horario } from '@/types/database';
import pool from '@/util/db';


//metodo para obtener un Horario
export async function getHorarioById(id: number): Promise<Horario> {
  const connection = await pool.getConnection();
  try {
    const [horario] = await connection.query<Horario>('SELECT * FROM horarios WHERE id = ?', [id]);
    return horario[0];
  } finally {
    connection.release();
  }
}

// metodo para crear un curso
/*export async function createCurso(nombre: string, color: string, tipo: TipoCurso): Promise<Curso> {
  const connection = await pool.getConnection();
  try {
    await connection.query('INSERT INTO cursos (nombre, color, tipo) VALUES (?, ?, ?)', [nombre, color, tipo]);
    const [curso] = await connection.query<Curso>('SELECT * FROM horarios WHERE id = LAST_INSERT_ID()');
    return curso[0];
  } finally {
    connection.release();
  }
}*/

// metodo para eliminar un Horario
export async function deleteHorario(id: number): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM horarios WHERE id = ?', [id]);
  } finally {
    connection.release();
  }
}

// metodo actualizar un curso
/*export async function updateCurso(id: number, nombre: string, color: string, tipo: TipoCurso): Promise<Curso> {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE cursos SET nombre = ?, color = ?, tipo = ? WHERE id = ?', [nombre, color, tipo, id]);
    const [curso] = await connection.query<Curso>('SELECT FROM horarios WHERE id = ?', [id]);
    return curso[0];
  } finally {
    connection.release();
  }
}*/


