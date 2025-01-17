import React from 'react';
import './Hora.css';


export default function Hora ({ hora }) {
    return (
      <div className="celda horas">{hora}</div>
    );
  }