
// Interface para los cursos
export interface Course {
  id: number;
  nombre: string;
  color: string;
  tipo?: 'TEORIA' | 'LABORATORIO';
  grupos?: Group[];
}

// Interface para los grupos
export interface Group {
  id: number;
  curso_id?: number;
  grupo: string;
  horarios?: TimeSlot[];
}

// Interface para los horarios de los grupos
export interface TimeSlot {
  id: number;
  grupo_id?: number;
  dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';
  hora_ini: string;
  hora_fin: string;
}

// Interface para la respuesta de la vista
export interface CourseData {
    TEORIA: Course[]
    LABORATORIO: Course[]
}
  
  