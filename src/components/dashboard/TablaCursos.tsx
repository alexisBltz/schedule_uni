import { useEffect, useState, useMemo } from 'react';
import { getCourses } from '@/util/api';
import type { CourseData, Course } from '@/types/course';

import Loading from '@/components/ui/loading';
import DataTable from './tabla/DataTable';
import { TabPanel } from '@headlessui/react';

interface TablaCursosProps {
  onSetRefresh: (refreshFn: () => void) => void;
  searchQuery: string; // Añadido searchQuery prop
}

const TablaCursos = ({ onSetRefresh, searchQuery }: TablaCursosProps) => {
    const [courses, setCourses] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        const loadCourses = () => {
            setLoading(true);
            getCourses()
                .then(setCourses)
                .catch(() => setError('No se pudo cargar la información de los cursos'))
                .finally(() => setLoading(false));
        };

        loadCourses();
    }, [refreshKey]);

    useEffect(() => {
        onSetRefresh(() => setRefreshKey(prev => prev + 1));    // Registrar la función de refresh con el componente padre
    }, [onSetRefresh]);

    const filteredCourses = useMemo(() => {
        if (!courses || typeof courses !== "object") { 
            return {    // Manejo seguro para cuando courses no está definido
                TEORIA: [],
                LABORATORIO: []
            };
        }
    
        // Función para filtrar cursos por nombre
        const filterByName = (courseArray: Course[] | undefined): Course[] => {
            if (!courseArray) return []; // Retorna vacío si la propiedad es undefined
            return courseArray.filter(course =>
                course.nombre.toLowerCase().includes(searchQuery.toLowerCase())
            );
        };
    
        // Retornar los cursos filtrados
        return {
            TEORIA: filterByName(courses.TEORIA),
            LABORATORIO: filterByName(courses.LABORATORIO)
        };
    }, [courses, searchQuery]);
    

    return (
        <div className='min-h-80'>
            {
                loading ? (
                    <div className='h-80 flex items-center'> <Loading /> </div>
                ) : error ? (
                    <div className="text-red-500 font-medium">{error}</div>
                ) : courses ? (
                    <div>
                        <TabPanel
                            key={"Teoría"}
                            className="mt-2 p-0 pb-[2px] md:mt-6 xl:p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl"
                        >
                            <DataTable 
                                data={filteredCourses.TEORIA} 
                                onRefresh={() => setRefreshKey(prev => prev + 1)} 
                            />
                        </TabPanel>
                        <TabPanel
                            key={"Laboratorio"}
                            className="mt-2 p-0 pb-[2px] md:mt-6 xl:p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl"
                        >
                            <DataTable 
                                data={filteredCourses.LABORATORIO} 
                                onRefresh={() => setRefreshKey(prev => prev + 1)} 
                            />
                        </TabPanel>
                    </div>
                ) : null
            }
        </div>
    );
};

export default TablaCursos;