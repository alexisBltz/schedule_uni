
    import './SelectCurso.css';

    export default function SelectCurso ({curso, valorSeleccionado, handleChange}) {
        return (
            <div style={{backgroundColor: curso.color}} className='container-select'>
                <div className='div-nombre-curso'><div className='nombre-curso'>{curso.nombre}</div></div>
                <select value={valorSeleccionado} onChange={(event) => handleChange(event.target.value)}
                    className='select-curso'
                >
                    <option value="" >Ninguno</option>
                    <OptionCurso curso={curso} />
                </select>
            </div>
        );
    }

    function OptionCurso ({curso}) {
        const gruposOrdenados = curso.grupos.sort((a, b) => a.grupo.localeCompare(b.grupo));
        console.log(gruposOrdenados);
        return curso.grupos.map(grupo => (
            <option key={`${curso.id}-${grupo.grupo}`} value={`${curso.id}-${grupo.grupo}`}>
                GRUPO {grupo.grupo}
            </option>
        ));
    }
