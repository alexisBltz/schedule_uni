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

    const generateICS = (selections, cursosTeo, cursosLab) => {
        const eventos = [];

        const diaToWeekday = (dia) => {
            const map = { LUNES: 1, MARTES: 2, MIERCOLES: 3, JUEVES: 4, VIERNES: 5 };
            return map[dia.toUpperCase()] || 1;
        };

        const nextDateForWeekday = (weekday) => {
            const today = new Date();
            const todayWeekday = (today.getDay() + 6) % 7 + 1; // convert Sun=0..Sat=6 to Mon=1..Sun=7
            let diff = weekday - todayWeekday;
            if (diff < 0) diff += 7;
            const d = new Date(today);
            d.setDate(today.getDate() + diff);
            d.setHours(0,0,0,0);
            return d;
        };

        const pad = (n) => String(n).padStart(2, '0');
        const formatICSDate = (date) => {
            return `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
        };

        const addEventsFrom = (cursos) => {
            cursos.forEach(curso => {
                const sel = selections[curso.id];
                if (!sel) return;
                const grupo = curso.grupos.find(g => `${curso.id}-${g.grupo}` === sel);
                if (!grupo) return;

                grupo.horarios.forEach(horario => {
                    const weekday = diaToWeekday(horario.dia);
                    const base = nextDateForWeekday(weekday);
                    const [hIni, mIni] = horario.hora_ini.split(':').map(s=>Number(s));
                    const [hFin, mFin] = horario.hora_fin.split(':').map(s=>Number(s));
                    const dtStartDate = new Date(base);
                    dtStartDate.setHours(hIni, mIni, 0, 0);
                    const dtEndDate = new Date(base);
                    dtEndDate.setHours(hFin, mFin, 0, 0);

                    const uid = `${curso.id}-${grupo.grupo}-${horario.dia}-${horario.hora_ini}-${Math.random().toString(36).slice(2,9)}`;

                    const summary = `${curso.nombre} (Grupo ${grupo.grupo})`;
                    const description = `Color: ${curso.color}\\nDía: ${horario.dia}\\nHora: ${horario.hora_ini} - ${horario.hora_fin}`;

                    // Recurrente semanal por 16 semanas
                    const rrule = 'FREQ=WEEKLY;COUNT=16';

                    eventos.push(
`BEGIN:VEVENT
UID:${uid}
SUMMARY:${summary}
DESCRIPTION:${description}
DTSTART:${formatICSDate(dtStartDate)}
DTEND:${formatICSDate(dtEndDate)}
RRULE:${rrule}
END:VEVENT`
                    );
                });
            });
        };

        addEventsFrom(cursosTeo || []);
        addEventsFrom(cursosLab || []);

        return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//schedule_uni//EN\n${eventos.join('\n')}\nEND:VCALENDAR`;
    };

    const handleExportCalendar = () => {
        try {
            const ics = generateICS(valoresSeleccionados, datosCursosTeo, datosCursosLab);
            const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'horario_uni.ics';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting calendar:', err);
            alert('No se pudo generar el archivo .ics');
        }
    };

    return (
        <div className='container-horario'>
            <div className='container-tablero'>
                <TablaHorario teoria={cursosTeo} laboratorio={cursosLab}/>
            </div>
            <div className='container-selectores'>
                <div style={{display: 'flex', gap: 8, marginBottom: 12}}>
                    <button onClick={handleShare} style={{padding: '8px 16px', background: '#6c47ff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>Compartir</button>
                    <button onClick={handleExportCalendar} style={{padding: '8px 16px', background: '#00b894', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>Exportar a Calendar</button>
                </div>
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
