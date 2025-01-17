import React from 'react';
import './Curso.css';

export default function Curso (props) {
    //const mostrar = props.valorSeleccionado === props.id ? 'visible' : 'oculto';
    const mostrar = props.valorSeleccionado === props.id ? 'block' : 'none';

    return (
        <div
            className={`curso`}
            style={{
                backgroundColor: props.backgroundColor,
                gridColumn: props.gridColumn,
                gridRow: `${props.gridRow} / span ${props.gridSpan}`,
                display: mostrar        
            }}
        >
            
                <div className='curso-hora'><p>{props.horaIni} - {props.horaFin}</p></div>
            
            <div className='div-curso-nombre'>
                <div className='curso-nombre'><h3>{props.nombre}</h3></div> 
            </div>
        </div>  
    );
  }