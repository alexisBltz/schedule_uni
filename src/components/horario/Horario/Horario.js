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


    const [cursosTeo, selectTeo, valoresSeleccionados, ] = Render({ baseDeDatos: datosCursosTeo, exposeState: true });
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

    const handleShare = () => {
        const encoded = encodeURIComponent(btoa(JSON.stringify(valoresSeleccionados)));
        const url = `${window.location.pathname}?sel=${encoded}`;
        window.history.replaceState(null, '', url);
        // También copiar al portapapeles
        navigator.clipboard.writeText(window.location.origin + url);
        alert('¡Enlace copiado al portapapeles!');
    };

    return (
        <div className='container-horario'>
            <div className='container-tablero'>
                <TablaHorario teoria={cursosTeo} laboratorio={cursosLab}/>
            </div>
            <div className='container-selectores'>
                <button onClick={handleShare} style={{marginBottom: 16, padding: '8px 16px', background: '#6c47ff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>Compartir</button>
                <Selectores 
                selectTeoria={selectTeo} 
                selectLab={selectLab}
                />
            </div>
        </div>
    );
}

function Render({ baseDeDatos, exposeState = false }) {
    // Leer del localStorage o de la URL al iniciar
    const [valoresSeleccionados, setValoresSeleccionados] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const sel = params.get('sel');
                if (sel) {
                    return JSON.parse(atob(decodeURIComponent(sel)));
                }
                const stored = localStorage.getItem('valoresSeleccionados');
                return stored ? JSON.parse(stored) : {};
            }
            return {};
        } catch {
            return {};
        }
    });

    // Guardar en localStorage cada vez que cambie
    useEffect(() => {
        try {
            localStorage.setItem('valoresSeleccionados', JSON.stringify(valoresSeleccionados));
        } catch {}
    }, [valoresSeleccionados]);

    const handleChange = (cursoId, valorSeleccionado) => {
        setValoresSeleccionados(prevState => ({
            ...prevState,
            [cursoId]: valorSeleccionado
        }));
    };

    const cursos = mapCursos(baseDeDatos, valoresSeleccionados, handleChange);
    const selectores = mapSelectores(baseDeDatos, valoresSeleccionados, handleChange);

    if (exposeState) {
        return [cursos, selectores, valoresSeleccionados, setValoresSeleccionados];
    }
    return [cursos, selectores];
}

function mapCursos(baseDeDatos, valoresSeleccionados) {
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
