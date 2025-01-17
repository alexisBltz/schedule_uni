import Horario from './Horario/Horario';
import './index.css';

export default function HorarioHome() {
    return (
        <div className="App">
          <h1 className='titulo-horario'>Horario de Clases</h1>
          <Horario />
        </div>
      );
}