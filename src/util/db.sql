-- Tabla cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  color VARCHAR(20) NOT NULL,
  tipo ENUM('TEORIA', 'LABORATORIO') NOT NULL,
  INDEX idx_tipo (tipo),
  INDEX idx_nombre (nombre)
);

-- Tabla grupos
CREATE TABLE IF NOT EXISTS grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  grupo VARCHAR(50) NOT NULL,
  INDEX idx_curso_id (curso_id),
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla horarios
CREATE TABLE IF NOT EXISTS horarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  dia ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES') NOT NULL,
  hora_ini TIME NOT NULL,
  hora_fin TIME NOT NULL,
  INDEX idx_grupo_id (grupo_id),
  INDEX idx_grupo_dia (grupo_id, dia),
  INDEX idx_dia (dia),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Elimina la vista si existe (MySQL no soporta IF NOT EXISTS en CREATE VIEW)
DROP VIEW IF EXISTS v_cursos_completos;

CREATE VIEW v_cursos_completos AS
SELECT
  c.id,
  c.nombre,
  c.tipo,
  c.color,
  COALESCE(
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', g.id,
        'grupo', g.grupo,
        'horarios', COALESCE(
          (
            SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                        'id', h.id,
                        'dia', h.dia,
                        'hora_ini', h.hora_ini,
                        'hora_fin', h.hora_fin
                      )
                   )
            FROM horarios h
            WHERE h.grupo_id = g.id
          ), JSON_ARRAY()
        )
      )
    ),
    JSON_ARRAY()
  ) AS grupos
FROM cursos c
LEFT JOIN grupos g ON g.curso_id = c.id
GROUP BY c.id, c.nombre, c.tipo, c.color;