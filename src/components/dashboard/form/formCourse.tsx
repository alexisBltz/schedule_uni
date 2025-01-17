import { useState, useEffect } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { COLORS } from '@/data/data';
import { Course } from '@/types/course';

interface FormCourseProps {
  type: 'theory' | 'lab';
  initialData?: Course | null;
  onSubmit: (data: Course) => void;
}

const FormCourse = ({ type, initialData, onSubmit }: FormCourseProps) => {
  const [formData, setFormData] = useState<Course>({
    id: initialData?.id ?? 0,
    nombre: initialData?.nombre || '',
    color: initialData?.color || COLORS[0],
    tipo: type === 'theory' ? 'TEORIA' : 'LABORATORIO'
  });

  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (initialData) {
      const nombre = initialData.nombre;
      setFormData({
        id: initialData.id,
        nombre: nombre,
        color: initialData.color,
        tipo: initialData.tipo
      });
      setDisplayValue(type === 'lab' && !nombre.startsWith('Lab - ') ? `Lab - ${nombre}` : nombre);
    } else {
      setDisplayValue(type === 'lab' ? 'Lab - ' : '');
    }
  }, [initialData, type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (type === 'lab') {
      if (!newValue.startsWith('Lab - ')) {
        newValue = 'Lab - ' + newValue.replace('Lab - ', '');
      }
      setDisplayValue(newValue);
      setFormData(prev => ({ ...prev, nombre: newValue }));
    } else {
      setDisplayValue(newValue);
      setFormData(prev => ({ ...prev, nombre: newValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: formData.id,
      nombre: formData.nombre,
      color: formData.color,
      tipo: formData.tipo
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {initialData?.id && (
          <Input
            id="id"
            label="ID del curso:"
            value={formData.id.toString()}
            onChange={(e) => setFormData(prev => ({ ...prev, id: parseInt(e.target.value) }))}
            disabled={true}
          />
        )}

        <Input
          id="nombre"
          label={`Curso de ${type === 'theory' ? 'Teoría' : 'Laboratorio'}`}
          value={displayValue}
          onChange={handleInputChange}
          required
          placeholder={type === 'lab' ? 'Lab - Nombre del curso' : 'Nombre del curso'}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Color:</label>
          <div className="grid grid-cols-8 md:grid-cols-10 gap-[14px]">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-7 h-7 rounded-full transform transition-all duration-200
                          hover:scale-110 focus:outline-none
                          ${formData.color === color 
                            ? 'ring-4 ring-offset-2 ring-blue-400 scale-110' 
                            : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'}`}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
      >
        {initialData ? 'Guardar Cambios' : 'Crear Curso'}
      </Button>
    </form>
  );
};

export default FormCourse;