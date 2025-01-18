import React from "react";
import "./TablaHorario.css";

import Hora from '../../Hora/Hora.js';
import Dia from '../../Dia/Dia.js';

export {getColumn, getRow, getRowSpan};


export default function TablaHorario ({teoria, laboratorio}) {
    return (
        <div className="container-tabla-horario" 
            style={{
                gridTemplateColumns: `auto repeat(${dias.length}, 1fr)`,
                gridTemplateRows: `auto repeat(${horasIni.length+1}, auto)`       
            }}
        >
                <div class="celda"></div>
                {renderDias()}
                {renderHoras()}
                {(renderGridItem())}
                {teoria}
                {laboratorio}
        </div>
    );
}

function renderGridItem() {
    return dias.slice(0).flatMap((_, i) => (
        horasIni.slice(0).map((_, k) => (
            <div
                className="grid-item"
                style={{
                    backgroundColor: "#f4f0fb",
                    borderRadius: ".2vw",
                    gridColumn: i + 2,
                    gridRow: k + 2,
                }}
                key={`${i}-${k}`}
            ></div>
        ))
    ));
}

function renderDias() {
    return dias.map((dia, index) => (
        <Dia key={index} nombre={dia} />
    ));
}

function renderHoras() {
    return horasIni.map((hora, index) => (
        <Hora key={index} hora={`${hora} - ${horasFin[index]}`} />
    ));
}

function getRow (horaIni) {
    return horasIni.indexOf(horaIni)+2;
}
function getRowSpan (horaIni, horaFin) {
    return horasFin.indexOf(horaFin) - horasIni.indexOf(horaIni)+1;
}
function getColumn (dia) {
    return dias.indexOf(dia)+2;
}

const horasIni = [
    "07:00", "07:50", "08:50", "09:40", "10:40", "11:30", "12:20", "13:10", "14:00", "14:50", "15:50", "16:40", "17:40", "18:30", "19:20", "20:10"
  ];
const horasFin = [
    "07:50", "08:40", "09:40", "10:30", "11:30", "12:20", "13:10", "14:00", "14:50", "15:40", "16:40", "17:30", "18:30", "19:20", "20:10", "21:00"
  ];
const dias = [
    "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"
  ];