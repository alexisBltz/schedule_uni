
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

// Interface para los cursos
export interface Curso {
    id: number;
    nombre: string;
    color: string;
    tipo: 'TEORIA' | 'LABORATORIO';
    grupos?: Grupo[];
}

// Interface para los grupos
export interface Grupo {
    id: number;
    curso_id?: number;
    grupo: string;
    horarios?: Horario[];
}

// Interface para los horarios de los grupos
export interface Horario {
    id: number;
    grupo_id?: number;
    dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';
    hora_ini: string;
    hora_fin: string;
}

  

// Interface para la respuesta de la vista
export interface CursoVista {
    id: number;
    nombre: string;
    tipo: 'TEORIA' | 'LABORATORIO';
    color: string;
    grupos: string; // JSON string que necesitará ser parseado
}