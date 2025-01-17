import React from 'react';
import './Dia.css';

export default function Dia({ nombre }) {
  return (
    <div className="celda dias">{nombre}</div>
  );
}

