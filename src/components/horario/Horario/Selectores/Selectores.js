import React from "react";
import "./Selectores.css";

export default function Selectores ({tituloTeoria, selectTeoria, tituloLab, selectLab}) {
    return (
        <>
            <div className="lista-selectores-container">
                <h3 className="titulo-selectores">{tituloTeoria}</h3>
                <div className="Selectores">
                {selectTeoria}
                
                {/* <div className="link-pdf">
                    <a href="https://drive.google.com/file/d/1gCI9XUsrTC3gMIW_BIGYjxlBmleISE8p/view?usp=sharing" 
                    target="_blank">link: horarios teoría</a>
                </div> */}
                </div>
            </div>

            <div className="lista-selectores-container">
                <h3 className="titulo-selectores">{tituloLab}</h3>
                <div className="Selectores">
                {selectLab}
                {/* </div>
                <div className="link-pdf">
                    <a href="https://www.youtube.com/watch?v=H0YSd6lMxRk" 
                    target="_blank">link: horarios laboratorio</a>
                </div> */}
                </div>
            </div>
        </>
    );
}