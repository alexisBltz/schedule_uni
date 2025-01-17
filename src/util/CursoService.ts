
import { CursoVista, Curso } from '@/types/database';
import pool from '@/util/db';

type TipoCurso = 'TEORIA' | 'LABORATORIO';

export async function getCursosByTipo(tipo: TipoCurso): Promise<CursoVista[]> {
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.query<CursoVista[]>(
      'SELECT * FROM v_cursos_completos WHERE tipo = ?',
      [tipo]
    );

    const filteredRows = rows.filter(row => 
      Array.isArray(row.grupos) && row.grupos[0] !== null
    );
    return filteredRows.map(row => ({
      id: row.id, // Concatenamos el id del curso con el id del grupo
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
    const [rows] = await connection.query<CursoVista[]>(
      'SELECT * FROM v_cursos_completos'
    );

    return rows.reduce<{ [key: string]: CursoVista[] }>((acc, row) => {
      const curso = {
        id: row.id,
        nombre: row.nombre,
        tipo: row.tipo,
        color: row.color,
        grupos: row.grupos[0] !== null ? row.grupos : null
      };

      if (!acc[row.tipo]) {     // Agrupamos los cursos por tipo
        acc[row.tipo] = [];
      }
      acc[row.tipo].push(curso);
      return acc;
    }, {});

  } finally {
    connection.release();
  }
}



//metodo para obtener un curso
export async function getCursoById({id}: Partial<Curso>): Promise<Curso> {
  const connection = await pool.getConnection();
  try {
    const [curso] = await connection.query<Curso>('SELECT * FROM cursos WHERE id = ?', [id]);
    return curso[0];
  } finally {
    connection.release();
  }
}

// metodo para crear un curso
export async function createCurso( {nombre, color, tipo}: Partial<Curso>): Promise<Curso> {
  const connection = await pool.getConnection();
  try {
    await connection.query('INSERT INTO cursos (nombre, color, tipo) VALUES (?, ?, ?)', [nombre, color, tipo]);
    const [curso] = await connection.query<Curso>('SELECT * FROM cursos WHERE id = LAST_INSERT_ID()');
    return curso[0];
  } finally {
    connection.release();
  }
}

// metodo para eliminar un curso
export async function deleteCurso({id}: Partial<Curso>): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('DELETE FROM cursos WHERE id = ?', [id]);
  } finally {
    connection.release();
  }
}

// metodo actualizar un curso ***sin modificar tipo***
export async function updateCurso({id, nombre, color}: Partial<Curso>): Promise<Curso> {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE cursos SET nombre = ?, color = ? WHERE id = ?', [nombre, color, id]);
    const [curso] = await connection.query<Curso>('SELECT id, nombre, color, tipo FROM cursos WHERE id = ?', [id]);
    return curso[0];
  } finally {
    connection.release();
  }
}


