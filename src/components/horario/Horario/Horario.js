import React, { useState, useEffect } from 'react';

import "./Horario.css";
//import datos from "../../data/datos.json"

import TablaHorario from './TablaHorario/TablaHorario';
import Selectores from './Selectores/Selectores';
import {getColumn, getRow, getRowSpan} from './TablaHorario/TablaHorario';

import SelectCurso from '../SelectCurso/SelectCurso';
import Curso from '../Curso/Curso';

import Loading from '@/components/ui/loading';
import { getCoursesByType } from '@/util/api';

export default function Horario () {    
    const [datosCursosTeo, setDatosCursosTeo] = useState([]);
    const [datosCursosLab, setDatosCursosLab] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
                try {
                    setLoading(true);
                    const [teoriaData, labData] = await Promise.all([
                        getCoursesByType('teoria'),
                        getCoursesByType('laboratorio')
                    ]);
                    setDatosCursosTeo(teoriaData);
                    setDatosCursosLab(labData);
                } catch (err) {
                    setError('Error al cargar los cursos. Por favor, intente nuevamente.');
                    console.error('Error fetching courses:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, []);

        const [cursosTeo, selectTeo] = Render({ baseDeDatos: datosCursosTeo });
        const [cursosLab, selectLab] = Render({ baseDeDatos: datosCursosLab });

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loading />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center min-h-[400px] text-red-500">
                    {error}
                </div>
            );
        }

    return (
        <div className='container-horario'>
            <div className='container-tablero'>
                <TablaHorario teoria={cursosTeo} laboratorio={cursosLab}/>
            </div>
            <div className='container-selectores'>
                <Selectores 
                tituloTeoria={"Seleccionar Cursos"}
                selectTeoria={selectTeo} 
                tituloLab={"Seleccionar Labs"}
                selectLab={selectLab}
                />
            </div>
        </div>
    );
}

function Render({ baseDeDatos }) {
    const [valoresSeleccionados, setValoresSeleccionados] = useState({});

    const handleChange = (cursoId, valorSeleccionado) => {
        setValoresSeleccionados(prevState => ({
            ...prevState,
            [cursoId]: valorSeleccionado
        }));
    };

    const cursos = mapCursos(baseDeDatos, valoresSeleccionados, handleChange);
    const selectores = mapSelectores(baseDeDatos, valoresSeleccionados, handleChange);

    return [cursos, selectores];
}

function mapCursos(baseDeDatos, valoresSeleccionados, handleChange) {
    return baseDeDatos.map((curso) => {
        return curso.grupos.map((grupo) => {
            return grupo.horarios.map((horario) => {
                const cursoId = `${curso.id}-${grupo.grupo}`;
                return (
                    <Curso
                        key={cursoId}
                        id={cursoId}
                        nombre={curso.nombre}
                        valorSeleccionado={valoresSeleccionados[curso.id] || ''}
                        backgroundColor={curso.color}
                        gridColumn={getColumn(horario.dia)}
                        gridRow={getRow(horario.hora_ini)}
                        gridSpan={getRowSpan(horario.hora_ini, horario.hora_fin)}
                        horaIni={horario.hora_ini}
                        horaFin={horario.hora_fin}
                    />
                );
            });
        });
    });
}

function mapSelectores(baseDeDatos, valoresSeleccionados, handleChange) {
    return baseDeDatos.map(curso => (
        <SelectCurso
            key={curso.id}
            curso={curso}
            valorSeleccionado={valoresSeleccionados[curso.id] || ''}
            handleChange={(valor) => handleChange(curso.id, valor)}
        />
    ));
}
